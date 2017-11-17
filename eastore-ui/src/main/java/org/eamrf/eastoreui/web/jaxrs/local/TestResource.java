package org.eamrf.eastoreui.web.jaxrs.local;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.service.StoreService;
import org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * jax-rs test resource with simple echo method. This can be used to make sure
 * all configuration is setup correctly for web services.
 * 
 * @author slenzi
 */
@Path("/test")
@Service("testResource")
public class TestResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;	
	
    @Autowired
    private StoreService eaStoreService;
    
	public TestResource() {

	}
	
    /**
     * Relays the message to E-A Store echo() service.
     * 
     * @param message - a message from the client which will be echoed back.
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/echo")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response echo(@QueryParam("message") String message) throws WebServiceException {
    	
    	logger.info(TestResource.class.getSimpleName() + " echo() called");
    	
    	String response;
		try {
			response = eaStoreService.echo(message);
		} catch (ServiceException e) {
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    
    	logger.info(response);
    	
    	return Response.ok(response, MediaType.APPLICATION_JSON).build();
    	
    }	

	@Override
	public Logger getLogger() {
		return logger;
	}

}
