package org.eamrf.eastore.ui.core.service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.DateUtil;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastore.ui.web.security.authworld.AuthWorldService;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.web.context.WebApplicationContext;

/**
 * Service for dealing with authentication, specifically authworld & ctep-iam.
 * 
 * This is a request scoped service. Spring will create a proxy to be injected as a dependency, and 
 * instantiate the target bean when it is needed in a request.
 * 
 * @author slenzi
 */
@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AuthenticationService {

    @InjectLogger
    private Logger logger;	
	
	@Autowired
	private HttpServletRequest request;
	
    @Autowired
    private AuthWorldService authworldService;  	
	
	public AuthenticationService() {
		
	}
	
	/**
	 * Check if the currently logged in user is an authworld admin.
	 * 
	 * @return
	 */
	public boolean isAuthWorldAdmin() {
		AuthWorldUser user = authworldService.getUserFromSession(request);
		if(user != null) {
			return user.isAdmin();
		}
		return false;
	}
	
	/**
	 * Check if authentication service is active
	 * 
	 * @return
	 */
	public boolean isAuthenticationActive() {
		return authworldService.isAuthWorldActive();
	}
	
	/**
	 * Fetch the NCI MD Number (aka CTEP ID) from the currently logged in AuthWorld user.
	 * 
	 * @return
	 * @throws ServiceException
	 */
	public String getUserId() throws ServiceException {
		
		AuthWorldUser user = authworldService.getUserFromSession(request);
		if(user == null) {
			throw new ServiceException("No AuthWorld user in the session");
		}
		String ctepId = user.getNciMdNum();
		if(StringUtil.isNullEmpty(ctepId)) {
			throw new ServiceException("Currently logged in AuthWorld user has a null or empty CTEP ID (ncimdnum)");
		}
		
		return user.getNciMdNum();
		
	}	
	
	/**
	 * Fetch the currently logged in user.
	 * 
	 * @return
	 * @throws ServiceException
	 */
	public AuthWorldUser getUser() {
		return authworldService.getUserFromSession(request);
	}
	
    /**
     * Check if there is an AuthWorldUser object in the session, but do not validate it.
     * 
     * @return
     */
    public Boolean haveUserInSession() {
    	AuthWorldUser user = authworldService.getUserFromSession(request);
    	if(user != null) {
    		return true;
    	}
    	return false;
    }
    
    /**
     * Check if there is an AuthWorldUser object in the session, and validate it.
     * 
     * @param - data from the authworld credentials cookie
     * @return
     * @throws ServiceException 
     */
    public Boolean haveValidUserInSession(String cookieData) throws ServiceException {
    	
    	return authworldService.haveValidUserInSession(request, cookieData);
 
    	
    }	
	
	/**
	 * Attempts to get an authworld user using data from the authworld credentials cookie
	 * 
	 * @param - data from the authworld credentials cookie
	 * @return
	 * @throws ServiceException
	 */
	public AuthWorldUser getUserFromAuthWorldCookie(String cookieData) {
		return authworldService.getUserFromAuthWorldCookie(request, cookieData);
	}
	
	/**
	 * Attempt to log the user in using data from authworld credentials cookie
	 * 
	 * @param - data from the authworld credentials cookie
	 * @return
	 */
	public Boolean doAutoLoginViaAuthWorldCookie(String cookieData) {
		AuthWorldUser user = authworldService.getUserFromAuthWorldCookie(request, cookieData);
		if(user == null) {
			return false;
		}
		logger.info("Successfully fetched AuthWorld user using cookie data!");
		authworldService.addUserToSession(user, request);
		return true;
	}
	
	/**
	 * Get name of AuthWorld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieName() {
		return authworldService.getAuthWorldCookieName();
	}
	
	/**
	 * Get domain of AuthWorld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieDomain() {
		return authworldService.getAuthWorldCookieDomain();
	}
	
	/**
	 * Parses and return the 'last active date' from the cookie data.
	 * 
	 * @param cookieDate
	 * @return
	 */		
	public String getAuthWorldCookieLastActiveDate(String cookieData) {
		return authworldService.getAuthWorldCookieLastActiveDate(cookieData);
	}
	
	/**
	 * Parses and return the 'login date' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getAuthWorldCookieLoginDate(String cookieData) {
		return authworldService.getAuthWorldCookieLoginDate(cookieData);
	}
	
	/**
	 * Parses and return the 'authworld session key' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getAuthWorldCookieSessionKey(String cookieData) {
		return authworldService.getAuthWorldCookieSessionKey(cookieData);
	}
	
	/**
	 * Parses and return the 'primary inst id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getAuthWorldCookiePrimaryInst(String cookieData) {
		return authworldService.getAuthWorldCookiePrimaryInst(cookieData);
	}
	
	/**
	 * Parses and return the 'user ctep id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getAuthWorldCookieCtepId(String cookieData) {
		return authworldService.getAuthWorldCookieCtepId(cookieData);
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
		return authworldService.buildAuthWorldCookieValue(ctepId, instId, sessionKey, loginDate, lastActiveDate);
	}
	
	/**
	 * Get the 'comments' to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieComments() {
		return authworldService.getAuthWorldCookieComments();
	}
	
	/**
	 * Get the 'path' to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookiePath() {
		return authworldService.getAuthWorldCookiePath();
	}
	
	/**
	 * Get the max age in seconds to be used/set on the authworld cookie
	 * 
	 * @return
	 */
	public Integer getAuthWorldCookieMaxAgeSeconds() {
		return authworldService.getAuthWorldCookieMaxAgeSeconds();
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
		return authworldService.buildAuthWorldHandoffUrl(relayState);
	}

	public void cookieTest(HttpServletResponse resp) {
		Cookie c = new Cookie("FubarCookieTest", "My Cookie Data = " + DateUtil.defaultFormat(DateUtil.getCurrentTime()));
		c.setDomain("ecog.org");
		c.setPath("/");
		resp.addCookie(c);		
	}

}
