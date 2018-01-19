package org.eamrf.eastoreui.web.jaxrs.local;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.service.AuthenticationService;
import org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler;
import org.eamrf.eastoreui.web.security.authworld.AuthWorldProps;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Authentication related web service functions called from our UI
 * 
 * @author slenzi
 *
 */
@Path("/ui/auth")
@Service("uiAuthService")
public class UIAuthResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private AuthenticationService authService;
    
    private final String TEST_COOKIE_NAME = "MyCookie";

    /**
     * Check if there is an authworld user in the session, but do not perform validation.
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/authworld/haveuser")
	@Produces(MediaType.APPLICATION_JSON)      
    public Boolean haveUserInSession() throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " haveUserInSession(...) called");

    	return authService.haveUserInSession();
    	
    }
    
    /**
     * Check if there is an authworld user in the session, and make sure it's valid.
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/authworld/havevaliduser")
	@Produces(MediaType.APPLICATION_JSON)      
    public Boolean haveValidUserInSession(@Context HttpHeaders headers) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " haveValidUserInSession(...) called");
    	
    	// only proceed if authentication is active
    	if(!authService.isAuthenticationActive()) {
    		return false;
    	}
    	
    	String cookieData = getAuthWorldCredentialCookieValue(headers);
    	if(cookieData.equals("")) {
    		return false;
    	}
    	
    	try {
    		return authService.haveValidUserInSession(cookieData);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	
    } 
    
    /**
     * Attempt to auto log in the user using data from authworld cookie
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/authworld/autologin")
	@Produces(MediaType.APPLICATION_JSON)      
    public Boolean autoLogin(@Context HttpHeaders headers) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " autoLogin(...) called");
    	
    	// only proceed if authentication is active
    	if(!authService.isAuthenticationActive()) {
    		return false;
    	}
    	
    	String cookieData = getAuthWorldCredentialCookieValue(headers);
    	if(cookieData.equals("")) {
    		return false;
    	}
    	
    	return authService.autoLoginViaCookie(cookieData);
    	
    }
    
    /**
     * Builds a URL for authworld handoff/redirection
     * 
     * @param relayState - The user will be automatically redirected to this
	 * URL after they successfully authenticate and log into authworld.
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/authworld/handoffurl")
	@Produces(MediaType.APPLICATION_JSON)      
    public String getHandOffUrl(@QueryParam("relayState") String relayState) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getHandOffUrl(...) called");
    	
    	logger.info("Relay State URL => " + relayState);

    	String handOffUrl = null;
    	try {
    		handOffUrl =  authService.buildAuthWorldHandoffUrl(relayState);
    		logger.info("HandOff URL => " + handOffUrl);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	return handOffUrl;
    	
    }    
    
    /**
     * Get the value string from the authworld credentials cookie
     * 
     * @param headers
     * @return
     */
    private String getAuthWorldCredentialCookieValue(HttpHeaders headers) {
    	
    	Cookie cookie = getAuthWorldCredentialsCookie(headers);
    	if(cookie == null) {
    		return null;
    	}
    	String cookieData = StringUtil.changeNull(cookie.getValue());
    	logger.info("authworld cookie data = " + cookieData);
    	return cookieData;	
    	
    }
    
    /**
     * Get the authworld credentials cookie from the http header, if it exists
     * 
     * @param headers
     * @return
     */
    private Cookie getAuthWorldCredentialsCookie(HttpHeaders headers) {
    	Map<String, Cookie> cookieMap = headers.getCookies();
    	return cookieMap.get(authService.getAuthWorldCookieName());
    }
    
    //@POST
    @GET
	@Path("/cookietest")    
    public Response cookieTest(@CookieParam(TEST_COOKIE_NAME) String cookie) throws WebServiceException {
    	
    	logger.info("Cookie Test");
    	
        if (cookie == null) {
        	
        	NewCookie newCookie = new NewCookie(TEST_COOKIE_NAME, "Cookie #1", "/", "ecogchair.org", "AuthWorld Cookie", Integer.MAX_VALUE, false);
        	        	
            return Response.ok(newCookie.toString()).cookie(newCookie).build();

        } else {
            
        	String cookieNum = cookie.substring(cookie.indexOf("#") + 1);
            int number = Integer.parseInt(cookieNum);
            number++;
            String updatedCookieValue = "Cookie #" + number;
            
            NewCookie updatedCookie = new NewCookie(TEST_COOKIE_NAME, updatedCookieValue, "/", "ecogchair.org", "AuthWorld Cookie", Integer.MAX_VALUE, false);
            
            return Response.ok(updatedCookie.toString()).cookie(updatedCookie).build();
        }
    	
    }    
    
	@Override
	public Logger getLogger() {
		return logger;
	}

}
