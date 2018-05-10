/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.server;

import org.eamrf.eastore.ui.core.socket.messaging.model.ResourceChangeMessage;

import org.springframework.stereotype.Service;

/**
 * Message service for notifying clients that resources have changed on the server.
 * 
 * Messages are broadcasted to /topic/resource/change
 * 
 * @author slenzi
 */
@Service
public class ResourceChangeBroadcastService extends AbstractBroadcastService {
    
    private final String messageDestination = "/topic/resource/change";
	
	public ResourceChangeBroadcastService() { }
	
	/**
	 * Broadcast a resource change message to all users
	 * 
	 * @param message
	 */
	public void broadcast(ResourceChangeMessage message) {
		convertAndSend(messageDestination, message);
	}
	
	/**
	 * Broadcast a resource change message to a specific user
	 * 
	 * @param message
	 * @param user
	 */
	public void broadcastToUser(ResourceChangeMessage message, String user) {
		convertAndSendToUser(messageDestination, message, user);
	}	

}
