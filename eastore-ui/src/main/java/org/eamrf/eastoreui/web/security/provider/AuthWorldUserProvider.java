package org.eamrf.eastoreui.web.security.provider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.eastoreui.core.exception.ServiceException;
import org.frontier.ecog.exception.EcogDatabaseException;
import org.frontier.ecog.webapp.authworld.client.AuthworldLoginService;
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
	
	@Autowired
	private HttpServletResponse response;	
	
	AuthworldLoginService loginService = new AuthworldLoginService();
	
	public AuthWorldUserProvider() {

	}
	
	/**
	 * Fetch currently logged in AuthWorld user.
	 * 
	 * @return
	 */
	public AuthWorldUser getUserFromSession(boolean updateLastActive) {
		return loginService.getUserFromSession(request, response, updateLastActive);
	}
	
	/**
	 * Check if we have a valid AuthWorld user in the session.
	 * 
	 * @return
	 */
	public boolean haveValidUserInSession() throws ServiceException {
		try {
			// TODO - change function so it does not throw an EcogDatabaseException
			return loginService.haveValidUserInSession(request, response);
		} catch (EcogDatabaseException e) {
			throw new ServiceException(e);
		}
	}
	
	/**
	 * Attempts to build and return an AuthWorldUser object using authworld session key from authworld cookie.
	 * 
	 * @return
	 */
	public AuthWorldUser getUserFromCookie() {
		
		return loginService.getUserFromCookie(request, response);
		
	}

}
