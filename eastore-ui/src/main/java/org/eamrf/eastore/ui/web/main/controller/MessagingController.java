/**
 * 
 */
package org.eamrf.eastore.ui.web.main.controller;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.service.MessagingService;
import org.eamrf.eastore.ui.core.socket.messaging.model.ClientConnectMessage;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

/**
 * Processes incoming stomp messages from clients
 * 
 * @author slenzi
 */
@Controller
public class MessagingController extends AbstractSpringController {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private MessagingService messagingService;
	
	/**
	 * 
	 */
	public MessagingController() {

	}
	
	@MessageMapping("/action/socket/connect")
	public void processConnectMessaga(ClientConnectMessage message) {
		
		logger.info("Client connected = " + message.toString());
		
	}

}
