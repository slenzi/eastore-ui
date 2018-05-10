package org.eamrf.eastore.ui.core.socket.messaging.client;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.slf4j.Logger;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.RestTemplateXhrTransport;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Service for creating stomp websocket connections.
 * 
 * @author slenzi
 *
 */
@Service
public class StompWebSocketService {

    @InjectLogger
    private Logger logger;
	
	private WebSocketStompClient stompClient = null;
	
	// keep track of all stomp sessions
	private Map<String,StompSession> stompSessionsMap = new HashMap<String,StompSession>();
	
	public StompWebSocketService() {
		
	}
	
	/**
	 * Open a stomp session to the remote stomp endpoint
	 * 
	 * @param stompEndpoint - the url to the stomp service
	 * @param handler - the stomp handler which defines which feeds to subscribe to and how to process incoming messages.
	 * @return
	 * @throws ServiceException
	 */
	public StompSession connect(URI stompEndpoint, StompSessionHandler handler) throws ServiceException {
		
		if(stompClient == null) {
			logger.info("Creating stomp client...");
			//stompClient = getStompClient();
			stompClient = getStompClientWithScheduler();			
		}
		
		ListenableFuture<StompSession> stompSessionFuture = stompClient.connect(stompEndpoint.toString(), handler);
		
		StompSession stompSession;
		try {
			stompSession = stompSessionFuture.get(10, TimeUnit.SECONDS);
		} catch (InterruptedException | ExecutionException | TimeoutException e) {
			throw new ServiceException(e.getMessage(), e);
		}
		
		if(stompSession != null) {
			
			logger.info("Have stomp session!");
			logger.info("Is connected? = " + ((stompSession.isConnected()) ? "Yes" : "No"));
			logger.info("Session ID = " + stompSession.getSessionId());
			
			stompSessionsMap.put(stompSession.getSessionId(), stompSession);
			
		}else {
			logger.info("No stomp session... boo.");
		}		
		
		return stompSession;
		
	}
	
	/**
	 * Close all open stomp sessions, then close the websocket connection.
	 */
	public void closeAllSessions() {
		
		closeAllSessions(false);
		
	}
	
	/**
	 * Close all open stomp sessions, and optionally close the websocket connection.
	 */	
	public void closeAllSessions(boolean closeSocket) {
		
		for(StompSession session : stompSessionsMap.values()) {
			if(session.isConnected()) {
				session.disconnect();
			}
		}
		stompSessionsMap.clear();
		
		if(closeSocket) {
			stompClient.stop();
		}
		
	}	
	
	private List<Transport> createTransportClient() {
		
		// https://docs.spring.io/spring-framework/docs/4.1.6.RELEASE/spring-framework-reference/html/websocket.html#websocket-fallback-sockjs-client
		
		return Arrays.asList(
				new WebSocketTransport(new StandardWebSocketClient()),
				new RestTemplateXhrTransport()); // fallback for xhr-streaming and xhr-polling
		
		//return Collections.singletonList(new WebSocketTransport(new StandardWebSocketClient()));
	}
	
	/**
	 * Create basic stomp websocket client
	 * 
	 * @return
	 */
	private WebSocketStompClient getStompClient() {
		
		WebSocketClient socketClient = new SockJsClient(createTransportClient());
		WebSocketStompClient stompClient = new WebSocketStompClient(socketClient);
		
		MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
		converter.setObjectMapper(objectMapper());
		stompClient.setMessageConverter(converter);

		return stompClient;
		
	}
	
	/**
	 * Create stomp websocket client configured with a scheduler for heartbeats and receipt tracking.
	 * 
	 * @return
	 */
	private WebSocketStompClient getStompClientWithScheduler() {
		
		WebSocketStompClient client = getStompClient();
		
		ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
		taskScheduler.afterPropertiesSet();
		client.setTaskScheduler(taskScheduler);

		return client;
		
	}
	
	public ObjectMapper objectMapper() {

		ObjectMapper objectMapper = new ObjectMapper()
				.registerModule(new Jdk8Module())
				.registerModule(new JavaTimeModule());
		
		//objectMapper.findAndRegisterModules();

		return objectMapper;

	}

}
