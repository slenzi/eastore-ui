/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.model;

import java.io.Serializable;

/**
 * Server sends a ClientConnectReplyMessage after it receives a ClientConnectMessage from a client.
 * 
 * @author slenzi
 */
public class ClientConnectReplyMessage implements Serializable {
	
	private static final long serialVersionUID = 1764383987929247338L;
	
	private String message;
	
	public ClientConnectReplyMessage() {
		super();
	}

	public ClientConnectReplyMessage(String message) {
		super();
		this.message = message;
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ClientConnectReplyMessage [message=" + message + "]";
	}
	
}
