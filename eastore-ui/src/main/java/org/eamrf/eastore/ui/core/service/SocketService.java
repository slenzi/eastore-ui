package org.eamrf.eastore.ui.core.service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.exception.ServiceException;
import org.eamrf.eastore.ui.core.socket.client.ResourceChangeStompClient;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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
    private ResourceChangeStompClient resourceChanceStompClient;
	
	public SocketService() {
		
		
	}
	
	@PostConstruct
	private void init() {
		
		logger.info("Starting web socket clients");
		
		try {
			resourceChanceStompClient.start();
		} catch (ServiceException e) {
			logger.error("Websocket error, failed to listen for eastore resource change events. " + e.getMessage());
			e.printStackTrace();
		}
		
	}
	
	@PreDestroy
	private void destroy() {
		
		resourceChanceStompClient.stop();
		
	}

}
