package org.eamrf.eastoreui.web.jaxrs.local;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.service.AuthenticationService;
import org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler;
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
	private HttpServletRequest request;
	
	@Autowired
	private HttpServletResponse response;    
    
    @Autowired
    private AuthenticationService authService;
    
    @POST
	@Path("/cookietest")
	@Produces(MediaType.APPLICATION_JSON)     
    public Response cookieTest() throws WebServiceException {
    	
    	logger.info("Cookie Test");
    	logger.info("Have request = " + ((request != null) ? "yes" : "no"));
    	logger.info("Have response = " + ((response != null) ? "yes" : "no"));
    	
    	authService.cookieTest(response);
    	
    	return Response.ok().build();
    	
    }

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
    public Boolean haveValidUserInSession() throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " haveValidUserInSession(...) called");
    	
    	try {
    		return authService.haveValidUserInSession();
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
    public Boolean autoLogin() throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " autoLogin(...) called");
    	
    	return authService.autoLoginViaCookie();
    	
    }    
    
	@Override
	public Logger getLogger() {
		return logger;
	}

}
