/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.model;

import java.io.Serializable;

/**
 * SockJS client (from angular layer) send a ClientConnectMessage after connecting
 * 
 * @author slenzi
 */
public class ClientConnectMessage {

	//private static final long serialVersionUID = -6378387768855920194L;
	
	private String userId;
	
	public ClientConnectMessage() {
		super();
	}

	public ClientConnectMessage(String userId) {
		super();
		this.userId = userId;
	}

	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}

	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ClientConnectMessage [userId=" + userId + "]";
	}
	
}
