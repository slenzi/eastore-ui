/**
 * 
 */
package org.eamrf.eastore.ui.web.jaxrs.local;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.client.util.StringUtil;
import org.eamrf.eastore.ui.core.exception.ServiceException;
import org.eamrf.eastore.ui.core.service.UIService;
import org.eamrf.eastore.ui.web.jaxrs.BaseResourceHandler;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author slenzi
 *
 */
@Path("/ui/search")
@Service("uiSearchResource")
public class UISearchResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private UIService uiService;	
	
	/**
	 * 
	 */
	public UISearchResource() {

	}

	/* (non-Javadoc)
	 * @see org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler#getLogger()
	 */
	@Override
	public Logger getLogger() {
		return logger;
	}
	
	/**
	 * Perform a basic search on file content
	 * 
	 * @param storeId - the ID of the store to search
	 * @param searchTerm - the search term to search for
	 * @param userId - id of user performing the search
	 * @return An instance of StoreSearchResult which encapsulates the search results
	 * @throws WebServiceException
	 */
	@GET
	@Path("/basic/content")
	@Produces(MediaType.APPLICATION_JSON)
	public Response doSearch(
			@QueryParam("storeId") Long storeId,
			@QueryParam("searchTerm") String searchTerm) throws WebServiceException {
		
		if(StringUtil.isNullEmpty(searchTerm) || storeId <= 0) {
    		handleError("Missing required params. Please check, storeId, and/or searchTerm values.", 
    				WebExceptionType.CODE_IO_ERROR);			
		}
		
    	String jsonResponse = null;
    	try {
	    	jsonResponse = uiService.runBasicContentSearch(storeId, searchTerm);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
    	
    	return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
	
	}

}
