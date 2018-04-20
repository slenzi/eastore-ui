package org.eamrf.eastore.ui.web.security.authworld;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;

import org.eamrf.core.exception.ServiceException;
import org.frontier.ecog.exception.EcogDatabaseException;
import org.frontier.ecog.webapp.authworld.client.AuthworldLoginService;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Hook for accessing AuthWorld authentication system
 * 
 * @author slenzi
 */
@Service
public class AuthWorldService {

	@Autowired
	private AuthWorldProps authworldProps;
	
	private AuthworldLoginService loginService = new AuthworldLoginService();
	
	public AuthWorldService() {

	}
	
	/**
	 * Check if authworld authentication integration is active (controlled by build property)
	 * 
	 * @return
	 */
	public boolean isAuthWorldActive() {
		return authworldProps.isActive();
	}
	
	/**
	 * Fetch currently logged in AuthWorld user.
	 * 
	 * @return
	 */
	public AuthWorldUser getUserFromSession(HttpServletRequest request) {
		return loginService.getUserFromSession(request);
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
	public boolean haveValidUserInSession(HttpServletRequest request, String cookieData) throws ServiceException {
		try {
			return loginService.haveValidUserInSession(request, cookieData);
		} catch (EcogDatabaseException e) {
			throw new ServiceException(e);
		}
	}
	
	/**
	 * Attempts to build and return an AuthWorldUser object using authworld session key from authworld cookie.
	 * 
	 * @return
	 */
	public AuthWorldUser getUserFromAuthWorldCookie(HttpServletRequest request, String cookieData) {
		return loginService.getUserByCookie(request, cookieData);
	}
	
	/**
	 * Adds the AuthWorld user to the session
	 * 
	 * @param user
	 */
	public void addUserToSession(AuthWorldUser user, HttpServletRequest request) {
		loginService.addUserToSession(user, request);
	}
	
	/**
	 * Get the name of the AuthWorld credentials cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieName() {
		return loginService.getCookieName();
	}
	
	/**
	 * Get the domain under which the cookie is stored
	 * 
	 * @return
	 */
	public String getAuthWorldCookieDomain() {
		return loginService.getCookieDomain();
	}
	
	/**
	 * Build the value string for the authworld credentials cookie
	 * 
	 * @param ctepId - users ctep id
	 * @param instId - primary inst id for their authworld session
	 * @param sessionKey - authworld sesion key for the users session
	 * @param loginDate - login date for the users authworld session
	 * @param lastActiveDate - last active date for the user
	 * @return
	 */
	public String buildAuthWorldCookieValue(String ctepId, String instId, String sessionKey, String loginDate, String lastActiveDate) {
		return loginService.buildCookieValue(ctepId, instId, sessionKey, loginDate, lastActiveDate);
	}
	
	/**
	 * Parses and return the 'last active date' from the cookie data.
	 * 
	 * @param cookieDate
	 * @return
	 */	
	public String getAuthWorldCookieLastActiveDate(String cookieData) {
		return loginService.getCookieLastActiveDate(cookieData); 
	}
	
	/**
	 * Parses and return the 'login date' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */	
	public String getAuthWorldCookieLoginDate(String cookieData) {
		return loginService.getCookieLoginDate(cookieData);
	}
	
	/**
	 * Parses and return the 'authworld session key' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */	
	public String getAuthWorldCookieSessionKey(String cookieData) {
		return loginService.getCookieSessionKey(cookieData);
	}

	/**
	 * Parses and return the 'primary inst id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */	
	public String getAuthWorldCookiePrimaryInst(String cookieData) {
		return loginService.getCookiePrimaryInst(cookieData);
	}
	
	/**
	 * Parses and return the 'user ctep id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */	
	public String getAuthWorldCookieCtepId(String cookieData) {
		return loginService.getCookieCtepId(cookieData);
	}
	
	/**
	 * Builds a URL for authworld handoff/redirection
	 * 
	 * @param relayState - optional relate state url. The user will be automatically redirected to this
	 * URL after the successfully authenticate and log into authworld.
	 * @return
	 * @throws ServiceException
	 */
	public String buildAuthWorldHandoffUrl(String relayState) throws ServiceException {
		try {
			return loginService.buildAuthWorldHandoffUrl(relayState);
		} catch (UnsupportedEncodingException e) {
			throw new ServiceException(e);
		}
	}
	
	/**
	 * Get the 'comments' to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieComments() {
		return authworldProps.getCookieComments();
	}
	
	/**
	 * Get the 'path' to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookiePath() {
		return authworldProps.getCookiePath();
	}
	
	/**
	 * Get the max age in seconds to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public Integer getAuthWorldCookieMaxAgeSeconds() {
		return authworldProps.getCookieMaxAgeSeconds();
	}
	
}
