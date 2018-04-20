package org.eamrf.eastore.ui.core.service;

import java.net.URI;
import java.net.URISyntaxException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.eamrf.eastore.ui.core.socket.messaging.client.GenericSessionHandler;
import org.eamrf.eastore.ui.core.socket.messaging.client.StompWebSocketService;
import org.eamrf.eastore.ui.core.socket.messaging.model.ResourceChangeMessage;
import org.eamrf.eastore.ui.core.socket.messaging.server.ResourceChangeBroadcastService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.stereotype.Service;

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
    
	// Subscription to EA Store 'resource change' messages
	//
	// @see eastore codebase:
	// org.eamrf.eastore.core.socket.messaging.ResourceChangeService
	// org.eamrf.eastore.core.config.WebSocketConfig
	private final String EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION = "/topic/resource/change";
	
	// handler which receives incoming resource change events from eastore, then rebroadcasts them
	// back out over the eastore-ui stomp websocket
	private GenericSessionHandler<ResourceChangeMessage> resourceChangeSessionHandler = new GenericSessionHandler<ResourceChangeMessage>(
			EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION,
			message -> {
				
				logger.info("Received resource change message, " + message.toString());
				
				resourceChangeBroadcaster.broadcast(message);
				
			}, ResourceChangeMessage.class);	
	
	public MessagingService() { }
	
	@PostConstruct
	private void init() {
		
		logger.info("Initializing stomp websocket connections...");
		
		// TODO
		
		// How to handle undesired disconnections? Do we need to create a thread
		// which periodically checks the state of the session and reconnect if
		// it's closed? e.g., eastore service is shutdown/re-deployed.
		
		StompSession stompSession = null;
		try {
			stompSession = stompSocketService.connect(getEaStoreEndpoint(), resourceChangeSessionHandler);
		} catch (ServiceException e) {
			logger.error("Websocket error, failed to listen for eastore resource change events. " + e.getMessage());
			e.printStackTrace();
		}
		
		logger.info("Initialization of stomp websocket connections complete!");
		
	}
	
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
	
	@PreDestroy
	private void destroy() {
		
		logger.info("Closing stomp websocket connections...");
		
		stompSocketService.closeAllSessions(true);
		
		logger.info("Closing of stomp websocket connections complete!");
		
	}

}
