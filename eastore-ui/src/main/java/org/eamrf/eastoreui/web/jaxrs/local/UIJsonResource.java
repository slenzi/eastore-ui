package org.eamrf.eastoreui.web.jaxrs.local;

import java.util.List;

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
import org.eamrf.gatekeeper.web.service.jaxws.model.Category;
import org.eamrf.gatekeeper.web.service.jaxws.model.Group;
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
     * Fetch all gatekeeper categories
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/gatekeeper/categories")
	@Produces(MediaType.APPLICATION_JSON)      
    public List<Category> getGatekeeperCategories() throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getGatekeeperCategories(...) called");
    	
    	List<Category> categories = null;
    	try {
    		categories = uiService.getGatekeeperCategories();
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	
    	return categories;
    	
    }
    
    /**
     * Fetch a gatekeeper category for a group
     * 
     * @param groupCode - the unique group code
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/gatekeeper/category")
	@Produces(MediaType.APPLICATION_JSON)      
    public Category getGatekeeperCategoryForGroup(@QueryParam("groupCode") String groupCode) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getGatekeeperCategoryForGroup(...) called");
    	
    	Category cat = null;
    	try {
			cat = uiService.getGatekeeperCategoryForGroup(groupCode);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	
    	return cat;
    	
    }
    
    /**
     * Fetch group by group code
     * 
     * @param groupCode - the unique group code
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/gatekeeper/group")
	@Produces(MediaType.APPLICATION_JSON)    
    public Group getGroup(@QueryParam("groupCode") String groupCode) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getGroup(...) called");
    	
    	Group group = null;
    	try {
			group = uiService.getGroup(groupCode);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	return group;
    	
    }
    
    /**
     * Fetch all gatekeeper groups for a specific category
     * 
     * @param categoryCode
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/gatekeeper/groups/category")
	@Produces(MediaType.APPLICATION_JSON)     
    public List<Group> getGatekeeperGroupsForCategory(@QueryParam("categoryCode") String categoryCode) throws WebServiceException {
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getGatekeeperGroupsForCategory(...) called");
    	
    	List<Group> groups = null;
    	try {
    		groups = uiService.getGatekeeperGroupsForCategory(categoryCode);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	
    	return groups;    	
    	
    }
    
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " getStoreByName(...) called");
    	logger.debug("storeName = "+storeName);
    	
    	// TODO - should stores have their own access group? Perhaps we can simply use the access group on the root
    	// not of the store to decide whether or not a user as permission to access the store. If the user is a member
    	// of any of the read groups for the store's root node, then they are considered to have access.    	
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	// TODO - should stores have their own access group? Perhaps we can simply use the access group on the root
    	// not of the store to decide whether or not a user as permission to access the store. If the user is a member
    	// of any of the read groups for the store's root node, then they are considered to have access.
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	// TODO - no access restriction on fetching the meta data for a path resource. 
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " stores() called");
    	
    	// TODO - no access restriction on fetching the meta data for a path resource. 
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " breadcrumb() called");
    	
    	// TODO - no access restriction on fetching breadcrumb data
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " breadcrumb() called");
    	
    	logger.debug("relPath = " + relPath);
    	
    	// TODO - no access restriction on fetching breadcrumb data
    	
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
    	
    	logger.debug(UIJsonResource.class.getSimpleName() + " loadRelativePath() called");
    	
    	logger.debug("relPath = " + relPath);
    	
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
