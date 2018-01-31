/**
 * 
 */
package org.eamrf.eastoreui.web.jaxrs.local;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

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
 * @author slenzi
 *
 */
@Path("/ui/tree")
@Service("uiTreeResource")
public class UITreeResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private UIService uiService;
    
	public UITreeResource() {
	
	}
	
	/**
	 * Fetch a text/html tree representation for the directory.
	 * 
	 * @param dirId
	 * @return
	 * @throws WebServiceException
	 */
	@GET
	@Path("/download/dirId/{dirId}")
	@Produces(MediaType.TEXT_HTML)	
	public String getPathResourceDownloadTree(@PathParam("dirId") Long dirId) throws WebServiceException {
		
		try {
			return uiService.getPathResourceDownloadTree(dirId);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
	}

	/* (non-Javadoc)
	 * @see org.eamrf.eastoreui.web.jaxrs.BaseResourceHandler#getLogger()
	 */
	@Override
	public Logger getLogger() {
		return logger;
	}

}
