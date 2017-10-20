package org.eamrf.eastoreui.web.jaxrs.local;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.service.UIService;
import org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * jax-rs resource responsible for feeding data to our front-end (javascript/angular UI)
 * 
 * @author slenzi
 *
 */
@Path("/ui/json")
@Service("uiJsonResource")
public class UIJsonResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private UIService uiService;
    
    /**
     * fetch eastore by name
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/store/name")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response getStoreByName(@QueryParam("storeName") String storeName) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " getStoreByName(...) called");
    	logger.info("storeName = "+storeName);
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getStoreByName(storeName);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }    
    
    /**
     * fetch all eastores
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/stores")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response stores() throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getStores();
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Fetch a path resource by it's id
     * 
     * @param nodeId - the id of the path resource. If the ID is of a file meta resource, the binary data
     * will not be included.
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/pathresource/node")
	@Produces(MediaType.APPLICATION_JSON) 
    public Response getPathResourceById(@QueryParam("nodeId") Long nodeId) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getPathResourceById(nodeId);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Fetch a path resource by store name, and relative path value of the resource in the store
     * 
     * @param storeName
     * @param relPath
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/pathresource/path")
	@Produces(MediaType.APPLICATION_JSON) 
    public Response getPathResourceByPath(
    		@QueryParam("storeName") String storeName, @QueryParam("relPath") String relPath) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getPathResourceByPath(storeName, relPath);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }    
    
    /**
     * Fetch breadcrumb tree by node id
     * 
     * @param nodeId - Id of some child path resource
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/breadcrumb/node")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response breadcrumb(@QueryParam("nodeId") Long nodeId) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " breadcrumb() called");
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getBreadcrumbsByNodeId(nodeId);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Fetch breadcrumb tree by store name and relpath
     * 
     * @param storeName
     * @param relPath
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/breadcrumb/path")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response breadcrumb(
    		@QueryParam("storeName") String storeName, @QueryParam("relPath") String relPath) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " breadcrumb() called");
    	
    	logger.info("relPath = " + relPath);
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getBreadcrumbsByPath(storeName, relPath);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Fetch child resources for eastore prodoc relative path
     * 
     * @param storeName
     * @param relPath
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/loadRelPath")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response loadRelativePath(
    		@QueryParam("storeName") String storeName, @QueryParam("relPath") String relPath) throws WebServiceException {
    	
    	logger.info(UIJsonResource.class.getSimpleName() + " loadRelativePath() called");
    	
    	logger.info("relPath = " + relPath);
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getChildPathResourceByPath(storeName, relPath);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }	

	@Override
	public Logger getLogger() {
		return logger;
	}    

}
