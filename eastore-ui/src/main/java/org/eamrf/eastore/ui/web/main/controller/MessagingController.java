/**
 * 
 */
package org.eamrf.eastore.ui.web.main.controller;

import java.security.Principal;
import java.util.StringJoiner;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.service.MessagingService;
import org.eamrf.eastore.ui.core.socket.messaging.model.ClientConnectMessage;
import org.eamrf.eastore.ui.core.socket.messaging.model.ClientConnectReplyMessage;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.util.MimeType;

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
	
	/**
	 * Process connect messages from UI layer
	 * 
	 * @param message
	 * @param headerAccessor
	 * @return
	 */
	@MessageMapping("/action/socket/connect")
	@SendTo("/topic/action/socket/connect")
	public ClientConnectReplyMessage processConnectMessaga(@Payload ClientConnectMessage message, SimpMessageHeaderAccessor headerAccessor) {
		
		logger.info("Received Client Connect Message");
		logger.info("message = " + message.toString());
		log(headerAccessor);
		
		String socketPrincipalId = headerAccessor.getUser().getName();
		String userId = message.getUserId();
		
		messagingService.trackUserSession(userId, socketPrincipalId);
		
		return new ClientConnectReplyMessage("User " + userId + " has connected.");
		
		//return "{ \"message\" : \"Server received connect message for user " + message.getUserId() + "\"}";
		
	}
	
	/**
	 * Log messaga headers
	 * 
	 * @param headerAccessor
	 */
	private void log(SimpMessageHeaderAccessor headerAccessor) {
		
		Principal userPrincipal = headerAccessor.getUser();
		
		StringJoiner joiner = new StringJoiner(", ", "Message Headers {", "}");
		
		joiner.add("id = " + headerAccessor.getId());
		joiner.add("destination = " + headerAccessor.getDestination());
		MimeType mimeType = headerAccessor.getContentType();
		joiner.add("mimeType = " + ((mimeType != null) ? mimeType.getType() : "null"));
		joiner.add("sessionId = " + headerAccessor.getSessionId());
		joiner.add("timeStamp = " + headerAccessor.getTimestamp());
		joiner.add("userPrincipalName = " + userPrincipal.getName());
		joiner.add("simpleMessageType = " + headerAccessor.getMessageType().toString());
		joiner.add("subscriptionId = " + headerAccessor.getSubscriptionId());
		
		MessageHeaders messageHeaders = headerAccessor.getMessageHeaders();
	
		logger.info(joiner.toString());
		logger.info("Message Headers toString() = " + messageHeaders.toString());
		
		
		
	}

}
