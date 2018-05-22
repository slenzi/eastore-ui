/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.server;

import org.eamrf.eastore.ui.core.socket.messaging.model.UserActionStatusMessage;
import org.springframework.stereotype.Service;

/**
 * Message service for notifying clients the status of various ongoing user actions
 * 
 * Messages are broadcasted to /topic/action
 * 
 * @author slenzi
 */
@Service
public class UserActionBroadcastService extends AbstractBroadcastService {
    
    private final String messageDestination = "/topic/action";
	
	public UserActionBroadcastService() { }
	
	/**
	 * Broadcast task status to all users
	 * 
	 * @param message
	 */
	public void broadcast(UserActionStatusMessage message) {
		convertAndSend(messageDestination, message);		
	}
	
	/**
	 * Broadcast task status to specific user
	 * 
	 * @param message
	 * @param principalUserId
	 */
	public void broadcastToUser(UserActionStatusMessage message, String user) {
		convertAndSendToUser(messageDestination, message, user);		
	}	

}
