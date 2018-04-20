/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.client;

import java.lang.reflect.Type;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.stomp.ConnectionLostException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

/**
 * A stomp session handler for processing incoming frames (messages). 
 * 
 * @author slenzi
 */
public class GenericStompSessionHandler<T> extends StompSessionHandlerAdapter {

	private Logger logger = LoggerFactory.getLogger(GenericStompSessionHandler.class.getName());
    
	private String destination = null;
	private Class<T> typeParameterClass = null;
    private Consumer<T> frameConsumer = null;
    private BiConsumer<StompSession, Throwable> disconnectConsumer = null;
	
	/**
	 * Create instance of resource change session handler
	 * 
	 * @param destination - the destination to subscribe to
	 * @param typeParameterClass - the class type of the incoming stomp frame (message)
	 * @param frameConsumer - the consumer that will process incoming resource change messages
	 * @param disconnectConsumer - the consumer that handles disconnect events
	 */
	public GenericStompSessionHandler(String destination, Class<T> typeParameterClass, 
			Consumer<T> frameConsumer, BiConsumer<StompSession, Throwable> disconnectConsumer) {
		
		this.destination = destination;
		this.typeParameterClass = typeParameterClass;
		this.frameConsumer = frameConsumer;
		this.disconnectConsumer = disconnectConsumer;
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
	@SuppressWarnings("unchecked")
	@Override
	public void handleFrame(StompHeaders headers, Object payload) {
		
		if(frameConsumer != null) {
			frameConsumer.accept((T) payload);
		}
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter#handleTransportError(org.springframework.messaging.simp.stomp.StompSession, java.lang.Throwable)
	 */
	@Override
	public void handleTransportError(StompSession session, Throwable e) {
		
		//logger.error(websocketMarker,"Transport error, {}", e.getMessage(), e);
		
		if (e instanceof ConnectionLostException) {
			
			//logger.error(websocketMarker,"Connection lost, {}", e.getMessage(), e);
			
			if(disconnectConsumer != null) {
				disconnectConsumer.accept(session, e);
			}
			
		}
	
	}
	


}
