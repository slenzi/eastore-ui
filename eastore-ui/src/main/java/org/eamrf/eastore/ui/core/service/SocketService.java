package org.eamrf.eastore.ui.core.service;

import java.net.URI;
import java.net.URISyntaxException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.exception.ServiceException;
import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.eamrf.eastore.ui.core.socket.client.ResourceChangeSessionHandler;
import org.eamrf.eastore.ui.core.socket.client.StompWebSocketService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.stereotype.Service;

/**
 * 
 * @author slenzi
 *
 */
@Service
public class SocketService {

    @InjectLogger
    private Logger logger;
    
	@Autowired
	private ManagedProperties appProps;    
    
    @Autowired
    private StompWebSocketService stompSocketService;
	
	public SocketService() { }
	
	@PostConstruct
	private void init() {
		
		logger.info("Initializing stomp websocket connections...");
		
		StompSession stompSession = null;
		try {
			
			stompSession = stompSocketService.connect(getEaStoreEndpoint(), new ResourceChangeSessionHandler());
			
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
