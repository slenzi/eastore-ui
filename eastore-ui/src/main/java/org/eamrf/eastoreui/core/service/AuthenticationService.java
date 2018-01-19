package org.eamrf.eastoreui.core.service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.core.util.DateUtil;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.web.security.authworld.AuthWorldService;
import org.frontier.ecog.webapp.authworld.constants.AuthWorldConstants;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
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

	@Autowired
	private HttpServletRequest request;
	
    @Autowired
    private AuthWorldService authworldService;  	
	
	public AuthenticationService() {
		
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
	public AuthWorldUser getUserFromCookie(String cookieData) {
		return authworldService.getUserFromCookie(request, cookieData);
	}
	
	/**
	 * Attempt to log the user in using data from authworld credentials cookie
	 * 
	 * @param - data from the authworld credentials cookie
	 * @return
	 */
	public Boolean autoLoginViaCookie(String cookieData) {
		AuthWorldUser user = authworldService.getUserFromCookie(request, cookieData);
		if(user == null) {
			return false;
		}
		authworldService.addUserToSession(user, request);
		return true;
	}
	
	/**
	 * Get name of AuthWorld cookie
	 * 
	 * @return
	 */
	public String getAuthWorldCookieName() {
		return authworldService.getCookieName();
	}
	
	/**
	 * Parses and return the 'last active date' from the cookie data.
	 * 
	 * @param cookieDate
	 * @return
	 */		
	public String getCookieLastActiveDate(String cookieData) {
		return authworldService.getCookieLastActiveDate(cookieData);
	}
	
	/**
	 * Parses and return the 'login date' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getCookieLoginDate(String cookieData) {
		return authworldService.getCookieLoginDate(cookieData);
	}
	
	/**
	 * Parses and return the 'authworld session key' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getCookieSessionKey(String cookieData) {
		return authworldService.getCookieSessionKey(cookieData);
	}
	
	/**
	 * Parses and return the 'primary inst id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getCookiePrimaryInst(String cookieData) {
		return authworldService.getCookiePrimaryInst(cookieData);
	}
	
	/**
	 * Parses and return the 'user ctep id' from the cookie data.
	 * 
	 * @param cookieData
	 * @return
	 */		
	public String getCookieCtepId(String cookieData) {
		return authworldService.getCookieCtepId(cookieData);
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
	public String buildCookieValue(String ctepId, String instId, String sessionKey, String loginDate, String lastActiveDate) {
		return authworldService.buildCookieValue(ctepId, instId, sessionKey, loginDate, lastActiveDate);
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
