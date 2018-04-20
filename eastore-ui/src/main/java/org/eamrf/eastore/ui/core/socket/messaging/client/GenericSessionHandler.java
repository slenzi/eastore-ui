/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.client;

import java.lang.reflect.Type;
import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

/**
 * A stomp session handler for processing incoming frames (messages). 
 * 
 * @author slenzi
 */
public class GenericSessionHandler<T> extends StompSessionHandlerAdapter {

	private Logger logger = LoggerFactory.getLogger(GenericSessionHandler.class.getName());
    
	private String destination = null;
    private Consumer<T> handleFrameConsumer = null;
    private Class<T> typeParameterClass = null;
	
	/**
	 * Create instance of resource change session handler
	 * 
	 * @param destination - the destination to subscribe to 
	 * @param handleFrameConsumer - the consumer that will process incoming resource change messages
	 * @param typeParameterClass - the class type of resource change message
	 */
	public GenericSessionHandler(String destination, Consumer<T> handleFrameConsumer, Class<T> typeParameterClass) {
		this.destination = destination;
		this.handleFrameConsumer = handleFrameConsumer;
		this.typeParameterClass = typeParameterClass;
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#afterConnected(org.springframework.messaging.simp.stomp.StompSession, org.springframework.messaging.simp.stomp.StompHeaders)
	 */
	@Override
	public void afterConnected(StompSession session, StompHeaders connectedHeaders) {

		logger.info("New session established : " + session.getSessionId());
		
		session.subscribe(destination, this);
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#getPayloadType(org.springframework.messaging.simp.stomp.StompHeaders)
	 */
	@Override
	public Type getPayloadType(StompHeaders headers) {
	
		return typeParameterClass;
		
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
		
		handleFrameConsumer.accept((T) payload);
		
	}

}
