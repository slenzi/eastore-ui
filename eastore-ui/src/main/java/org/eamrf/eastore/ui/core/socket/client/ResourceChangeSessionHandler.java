/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.client;

import java.lang.reflect.Type;

import org.eamrf.eastore.ui.core.socket.messaging.model.ResourceChangeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

/**
 * A stomp session handler for processing incoming 'ResourceChangeMessage' objects from eastore. 
 * 
 * @author slenzi
 */
public class ResourceChangeSessionHandler extends StompSessionHandlerAdapter {

	private Logger logger = LoggerFactory.getLogger(ResourceChangeSessionHandler.class.getName());
	
	// Subscription to EA Store 'resource change' messages
	//
	// @see eastore codebase:
	// org.eamrf.eastore.core.socket.messaging.ResourceChangeService
	// org.eamrf.eastore.core.config.WebSocketConfig
	private final String EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION = "/topic/resource/change";
	
	/**
	 * 
	 */
	public ResourceChangeSessionHandler() {
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#afterConnected(org.springframework.messaging.simp.stomp.StompSession, org.springframework.messaging.simp.stomp.StompHeaders)
	 */
	@Override
	public void afterConnected(StompSession session, StompHeaders connectedHeaders) {

		logger.info("New session established : " + session.getSessionId());
		
		session.subscribe(EA_STORE_RESOURCE_CHANGE_STOMP_SUBSCRIPTION, this);
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#getPayloadType(org.springframework.messaging.simp.stomp.StompHeaders)
	 */
	@Override
	public Type getPayloadType(StompHeaders headers) {
		
		return ResourceChangeMessage.class;
	}
	

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#handleException(org.springframework.messaging.simp.stomp.StompSession, org.springframework.messaging.simp.stomp.StompCommand, org.springframework.messaging.simp.stomp.StompHeaders, byte[], java.lang.Throwable)
	 */
	@Override
	public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
		
		logger.error("Got an exception", exception);
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#handleFrame(org.springframework.messaging.simp.stomp.StompHeaders, java.lang.Object)
	 */
	@Override
	public void handleFrame(StompHeaders headers, Object payload) {
		
		ResourceChangeMessage message = (ResourceChangeMessage)payload;
		
		// TODO - forward message along to front-end
		
		logger.info(message.toString());
		
	}
	


}
