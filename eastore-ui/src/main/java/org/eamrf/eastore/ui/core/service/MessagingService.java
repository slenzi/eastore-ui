package org.eamrf.eastore.ui.core.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;
import java.util.StringJoiner;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.eamrf.eastore.ui.core.socket.messaging.client.GenericStompSessionHandler;
import org.eamrf.eastore.ui.core.socket.messaging.client.StompWebSocketService;
import org.eamrf.eastore.ui.core.socket.messaging.model.ResourceChangeMessage;
import org.eamrf.eastore.ui.core.socket.messaging.server.HelloMessageService;
import org.eamrf.eastore.ui.core.socket.messaging.server.ResourceChangeBroadcastService;
import org.eamrf.eastore.ui.core.socket.messaging.util.StompSessionTracker;
import org.slf4j.Logger;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.github.rholder.retry.RetryException;
import com.github.rholder.retry.Retryer;
import com.github.rholder.retry.RetryerBuilder;
import com.github.rholder.retry.StopStrategies;
import com.github.rholder.retry.WaitStrategies;
import com.google.common.base.Predicates;

/**
 * Handles sending and receiving messages over websockets.
 * 
 * @author slenzi
 */
@Service
public class MessagingService {

    @InjectLogger
    private Logger logger;
    
	@Autowired
	private ManagedProperties appProps;    
    
    @Autowired
    private StompWebSocketService stompSocketService;
    
    @Autowired
    private ResourceChangeBroadcastService resourceChangeBroadcaster;
    
    @Autowired
    private HelloMessageService helloMessageService;
    
    private final Marker websocketMarker = MarkerFactory.getMarker("[WebSocket]");
    
    private StompSessionTracker stompSessionTracker = new StompSessionTracker();
    
    private ExecutorService executorService = Executors.newFixedThreadPool(1);
    private ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1);
    
	// Subscription to EA Store 'resource change' messages
	// @see eastore codebase:
	// org.eamrf.eastore.core.socket.messaging.ResourceChangeService
	// org.eamrf.eastore.core.config.WebSocketConfig
	private final String EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION = "/topic/resource/change";
	
	// handler which receives incoming resource change events from eastore, then re-broadcasts them
	// over the eastore-ui stomp websocket
	private GenericStompSessionHandler<ResourceChangeMessage> eaStoreResourceChangeSessionHandler = new GenericStompSessionHandler<ResourceChangeMessage>(
			EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION,
			ResourceChangeMessage.class,
			(stompHeaders, message) -> {
				
				logger.info(websocketMarker, "Received resource change message from eastore:");		
				
				logger.info("Headers =\n");
				List<String> headerValueList = null;
				Set<String> headerKeySet = stompHeaders.keySet();
				for(String headerKey : headerKeySet) {
					headerValueList = stompHeaders.get(headerKey);
					StringJoiner sj = new StringJoiner(":", headerKey + " [", "]");
					for(String headerValue : headerValueList) {
						sj.add(headerValue);
					}
					logger.info(sj.toString());
				}				
				
				logger.info("Message =\n" + message.toString());
				
				resourceChangeBroadcaster.broadcast(message);
				
			},
			(stompSession, throwable) -> {
				logger.info(websocketMarker, "Session {} was lost, {}", stompSession.getSessionId(), throwable.getMessage(), throwable);
				logger.info("Attempting to re-establish stomp websocket connection to EA-Store service.");
				initEaStoreConnection();
			});	
	
	public MessagingService() { }
	
	/**
	 * Initialize messaging service by connecting to eastore stomp websocket endpoint and
	 * subscribing to the "resource change" destination. If a connection to eastore cannot
	 * be made then it will continue to retry until successful. Once a connection has been
	 * made all incoming resource change messages will be re-broadcasted via the eastore-ui
	 * websocket endpoint. 
	 */
	@PostConstruct
	private void init() {
		
		initEaStoreConnection();
		
		sendHelloToClients();
		
	}	
	
	@PreDestroy
	private void destroy() {
		
		logger.info(websocketMarker, "Shutting down messaging services...");
	
		executorService.shutdownNow();
		scheduledExecutorService.shutdownNow();		
		
		stompSocketService.closeAllSessions(true);
		
		logger.info(websocketMarker, "Shutddown of messaging services complete.");
		
	}
	
	/**
	 * Create web socket connection to EA-Store and subscribe to resource change messages.
	 * 
	 * If a connection to EA-Store cannot be made then it will continue to retry until successful.
	 * Once a connection has been made all incoming resource change messages will be re-broadcasted
	 * via the EA-Store-UI websocket endpoint.
	 */
	private void initEaStoreConnection() {
		
		logger.info(websocketMarker, "Initializing EA-Store stomp websocket connection...");
		
		Callable<StompSession> connectCallable = new Callable<StompSession>() {
		    public StompSession call() throws Exception {
		    	StompSession stompSession = null;
		    	try {
		    		stompSession = stompSocketService.connect(getEaStoreEndpoint(), eaStoreResourceChangeSessionHandler);
				} catch (ServiceException e) {
					logger.error(websocketMarker, "Failed to connect to eastore and subscribe to resource "
							+ "change events, " + e.getMessage());
					return null;
				}
		    	return stompSession;
		    }
		};
		
		Retryer<StompSession> retryer = RetryerBuilder.<StompSession>newBuilder()
				.retryIfResult(Predicates.<StompSession>isNull())
		        .retryIfResult(stompSession -> {
		        	if(!stompSession.isConnected()) {
		        		logger.info(websocketMarker, "Stomp session for eastore resource change events is not connected. Retrying again...");
		        		return true;
		        	}
		        	return false;
		        })
		        .withWaitStrategy(WaitStrategies.fixedWait(30, TimeUnit.SECONDS))
		        .withStopStrategy(StopStrategies.neverStop())
		        .build();
		
		executorService.execute(new Runnable() {
		    public void run() {
				StompSession stompSession = null;
				try {
					stompSession = retryer.call(connectCallable);
				} catch (RetryException e) {
				    e.printStackTrace();
				} catch (ExecutionException e) {
				    e.printStackTrace();
				}		    	
				logger.info(websocketMarker, "Initialization of stomp websocket connections complete!");
		    }
		});		
		
	}
	
	/**
	 * Creates a thread which periodically sends a hello message to all connected websocket clients.
	 */
	private void sendHelloToClients() {
		
		Runnable helloMessageRunnable = new Runnable() {
		    public void run() {
		    	Set<String> userIdSet = stompSessionTracker.getUserIds();
		    	Set<String> principalIdSet = null;
		    	for(String userId : userIdSet) {
		    		principalIdSet = stompSessionTracker.getPrincipalUserIdsForUser(userId);
		    		for(String principalUserId : principalIdSet) {
		    			helloMessageService.sendHello(principalUserId, "Hello user " + userId + "!");
		    		}
		    	}
		    }
		};
		scheduledExecutorService.scheduleAtFixedRate(helloMessageRunnable, 0, 30, TimeUnit.SECONDS);
		
	}
	
	/**
	 * Return the URI for the EA-Store stomp endpoint.
	 * 
	 * @return
	 * @throws ServiceException
	 */
	private URI getEaStoreEndpoint() throws ServiceException {
		
		URI stompUri = null;
		String stompUrlEndpoint = appProps.getProperty("eastore.stomp.service");
		try {
			stompUri = new URI(stompUrlEndpoint);
		} catch (URISyntaxException e) {
			throw new ServiceException("Invalid stomp URL endpoint, " + stompUrlEndpoint + ", " + e.getMessage());
		}
		return stompUri;
		
	}
	
	/**
	 * Track the principal user id for the ecog-acrin user. This lets us know which web socket connections
	 * belong to which ecog-acrin users.
	 * 
	 * @param userId - The user id of the ecog-acrin user (i.e. ctep id)
	 * @param principalUserId - the stomp principal user id
	 */
	public void trackUserSession(String userId, String principalUserId) {
		
		logger.info("Tracking messaging principal " + principalUserId + " for user " + userId);
		
		stompSessionTracker.addSession(principalUserId, userId);
	
	}
	
	/**
	 * Untrack the principal user id for the ecog-acrin user.
	 * 
	 * @param principalUserId - the stomp principal user id
	 */
	public void untrackUserSession(String principalUserId) {
		
		logger.info("Untracking messaging principal " + principalUserId);
		
		stompSessionTracker.removeSession(principalUserId);
		
	}
	
	/**
	 * Listen for STOMP connect events.
	 * 
	 * @param event
	 */
    @EventListener
    public void onSocketConnectedEvent(SessionConnectedEvent event) {
    	
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        
        String principalUserId = sha.getUser().getName();
        
        logger.info("[Stomp over WebSocket Connected Event] {sessionId = " + sha.getSessionId() + ", principalUseId = " + principalUserId + "}");
        
    }

    /**
     * Listen for STOMP disconnect events.
     * 
     * @param event
     */
    @EventListener
    public void onSocketDisconnectedEvent(SessionDisconnectEvent event) {
    	
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        
        String principalUserId = sha.getUser().getName();
        
        logger.info("[Stomp over WebSocket Disonnected Event] {sessionId = " + sha.getSessionId() + ", principalUseId = " + principalUserId + "}");
        
        untrackUserSession(principalUserId);
        
    }
    
    /**
     * Listen for STOMP subscription events.
     * 
     * @param event
     */
    @EventListener
    public void onSocketSubscribeEvent(SessionSubscribeEvent event) {
    	
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        
        String principalUserId = sha.getUser().getName();
        
        logger.info("[Stomp over WebSocket Subscribed Event] {sessionId = " + sha.getSessionId() + ", principalUseId = " + principalUserId + "}");
        
    } 
    
    /**
     * Listen for STOMP unsubscribe events.
     * 
     * @param event
     */
    @EventListener
    public void onSocketSubscribeEvent(SessionUnsubscribeEvent event) {
    	
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        
        String principalUserId = sha.getUser().getName();
        
        logger.info("[Stomp over WebSocket Unsubscribed Event] {sessionId = " + sha.getSessionId() + ", principalUseId = " + principalUserId + "}");
        
    }	

}
