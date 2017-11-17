package org.eamrf.eastoreui.web.security.provider;

import javax.servlet.http.HttpServletRequest;

import org.frontier.ecog.webapp.authworld.client.AuthWorldClient;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

/**
 * Provider for AuthWorld user
 * 
 * @author slenzi
 *
 */
@Service
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AuthWorldUserProvider {

	@Autowired
	private HttpServletRequest request;	
	
	public AuthWorldUserProvider() {
		
	}
	
	/**
	 * Fetch currently logged in AuthWorld user.
	 * 
	 * @return
	 */
	public AuthWorldUser getUser() {
		return AuthWorldClient.getAuthWorldUser(request);
	}
	
	/**
	 * Check if we have an AuthWorld user in the session.
	 * 
	 * @return
	 */
	public boolean haveUser() {
		return AuthWorldClient.getAuthWorldUser(request) != null;
	}

}
