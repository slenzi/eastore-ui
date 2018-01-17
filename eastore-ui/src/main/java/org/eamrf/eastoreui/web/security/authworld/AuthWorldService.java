package org.eamrf.eastoreui.web.security.authworld;

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
 * Hook for accessing AuthWorld authentication system
 * 
 * @author slenzi
 *
 */
// @Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Service
public class AuthWorldService {
	
	@Autowired
	private AuthWorldProps authworldProps;
	
	AuthworldLoginService loginService = new AuthworldLoginService();
	
	public AuthWorldService() {

	}
	
	/**
	 * Fetch currently logged in AuthWorld user.
	 * 
	 * @return
	 */
	public AuthWorldUser getUserFromSession(HttpServletRequest request, HttpServletResponse response) {
		
		boolean isAuthWorldActive = authworldProps.isActive();
		
		if(isAuthWorldActive) {
			// only update last active time in cookie if authworld integration is active
			return loginService.getUserFromSession(request, response, true);
		}else {
			return loginService.getUserFromSession(request, response, false);
		}
	}
	
	/**
	 * Check if we have a valid AuthWorld user in the session.
	 * 
	 * - Get user from session
	 * - Validate user session key
	 * - Validate AuthWorld login
	 * - Validate inactivity 
	 * 
	 * @return
	 */
	public boolean haveValidUserInSession(HttpServletRequest request, HttpServletResponse response) throws ServiceException {
		try {
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
	public AuthWorldUser getUserFromCookie(HttpServletRequest request, HttpServletResponse response) {
		
		return loginService.getUserFromCookie(request, response);
		
	}
	
	/**
	 * Adds the AuthWorld user to the session
	 * 
	 * @param user
	 */
	public void addUserToSession(AuthWorldUser user, HttpServletRequest request) {
		
		loginService.addUserToSession(user, request);
		
	}

}
