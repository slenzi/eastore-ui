package org.eamrf.eastore.ui.core.socket.client;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import javax.annotation.PostConstruct;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.exception.ServiceException;
import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

/**
 * Listener which uses a web socket connection to subscribe to 'resource change' events from eastore.
 * 
 * @author slenzi
 *
 */
@Service
public class ResourceChangeStompClient {

	@InjectLogger
	private Logger logger;
	
	@Autowired
	private ManagedProperties appProps;
	
	//private boolean running = false;
	
	private final String SERVICE_DESC = "EA Store Resource Change Events";
	
	private WebSocketStompClient stompClient = null;
	
	public ResourceChangeStompClient() {
		
	}
	
	public void start() throws ServiceException {
		
		logger.info("Starting stomp client for " + SERVICE_DESC);
		
		//running = true;
		
		stompClient = getStompClient();
		
		URI stompUri = getEnpointUri();
		logger.info("Stomp endpoint = " + stompUri.toString());
		ResourceChangeSessionHandler sessionHandler = new ResourceChangeSessionHandler();
		
		ListenableFuture<StompSession> stompSessionFuture = stompClient.connect(
				stompUri.toString(), sessionHandler);
		
		boolean wasError = false;
		
		//while(running) {
			
			logger.info("...Checking for " + SERVICE_DESC);
		
			StompSession stompSession = null;
			try {
				stompSession = stompSessionFuture.get(10, TimeUnit.SECONDS);
			} catch (InterruptedException | ExecutionException | TimeoutException e) {
				wasError = true;
				logger.error(e.getMessage());
				e.printStackTrace();
			} finally {
				if(wasError) {
					logger.info("Cancelling stomp session for " + SERVICE_DESC);
					if(stompSessionFuture.isCancelled()) {
						stompSessionFuture.cancel(true);
					}
					stompSession.disconnect();
					stop();
				}
			}			
			
		//}
		
		//stompClient.stop();
		
		//logger.info("Terminating stomp client for " + SERVICE_DESC);
		
	}
	
	public void stop() {
		//running = false;
		logger.info("Terminating stomp client for " + SERVICE_DESC);
		stompClient.stop();
	}
	
	private URI getEnpointUri() throws ServiceException {
		
		URI stompUri = null;
		String stompUrlEndpoint = appProps.getProperty("eastore.stomp.service");
		try {
			stompUri = new URI(stompUrlEndpoint);
		} catch (URISyntaxException e) {
			throw new ServiceException("Invalid stomp URL endpoint, " + stompUrlEndpoint + ", " + e.getMessage());
		}
		return stompUri;
		
	}
	
	private List<Transport> createTransportClient() {
		return Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()));
	}	
	
	private WebSocketStompClient getStompClient() throws ServiceException {
		
		ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
		taskScheduler.afterPropertiesSet();
		
	    WebSocketStompClient stompClient = new WebSocketStompClient(
	            new SockJsClient(createTransportClient()));
		
		stompClient.setMessageConverter(new MappingJackson2MessageConverter());
		stompClient.setTaskScheduler(taskScheduler);
		
		return stompClient;
	}

}
