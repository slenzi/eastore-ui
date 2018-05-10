/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.server;

import org.eamrf.eastore.ui.core.socket.messaging.model.FileServiceTaskStatus;

import org.springframework.stereotype.Service;

/**
 * Message service for notifying clients the status of various ongoing eastore file service tasks.
 * 
 * Messages are broadcasted to /topic/file/task
 * 
 * @author slenzi
 */
@Service
public class FileServiceTaskBroadcastService extends AbstractBroadcastService {
    
    private final String messageDestination = "/topic/file/task";
	
	public FileServiceTaskBroadcastService() { }
	
	/**
	 * Broadcast task status to all users
	 * 
	 * @param message
	 */
	public void broadcast(FileServiceTaskStatus message) {
		convertAndSend(messageDestination, message);		
	}
	
	/**
	 * Broadcast task status to specific user
	 * 
	 * @param message
	 * @param principalUserId
	 */
	public void broadcastToUser(FileServiceTaskStatus message, String user) {
		convertAndSendToUser(messageDestination, message, user);		
	}	

}
