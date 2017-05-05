package org.eamrf.eastoreui.web.jaxrs.local;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.model.file.FileResponse;
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
@Path("/ui")
@Service("uiResource")
public class UIResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private UIService uiService;
    
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
    	
    	logger.info(UIResource.class.getSimpleName() + " breadcrumb() called");
    	
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
     * Fetch breadcrumb tree by relpath
     * 
     * @param nodeId - Id of some child path resource
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/breadcrumb/path")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response breadcrumb(@QueryParam("relPath") String relPath) throws WebServiceException {
    	
    	logger.info(UIResource.class.getSimpleName() + " breadcrumb() called");
    	
    	logger.info("relPath = " + relPath);
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getBreadcrumbsByPath(relPath);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Fetch child resources for eastore prodoc relative path
     * 
     * @return
     * @throws WebServiceException
     */
    @GET
	@Path("/loadRelPath")
	@Produces(MediaType.APPLICATION_JSON)    
    public Response loadRelativePath(@QueryParam("relPath") String relPath) throws WebServiceException {
    	
    	logger.info(UIResource.class.getSimpleName() + " loadRelativePath() called");
    	
    	logger.info("relPath = " + relPath);
    	
    	String jsonReponse = null;
		try {
			jsonReponse = uiService.getChildPathResourceByPath(relPath);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonReponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
	@GET
	@Path("/download/id/{fileId}")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadFileById(@PathParam("fileId") Long fileId) throws WebServiceException {
		
		logger.info(UIResource.class.getSimpleName() + " downloadFileById() called");
		
		FileResponse fresp = null;
		try {
			fresp = uiService.getFile(fileId);
		} catch (ServiceException e) {
			if(fresp != null && fresp.hasInputStream()){
				fresp.close();
			}
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return writeFileToResponse(fresp.getInput(), fresp.getName());
		
	}
	
	/**
	 * Writes the file data to the response
	 * 
	 * @param input
	 * @param fileName
	 * @return
	 */
	private Response writeFileToResponse(InputStream input, String fileName) {
		
		//
		// Write data to output/response
		//
		//ByteArrayInputStream bis = new ByteArrayInputStream(fileMeta.getBinaryResource().getFileData());
		
		//ContentDisposition contentDisposition = ContentDisposition.type("attachment")
		//	    .fileName("filename.csv").creationDate(new Date()).build();
		//ContentDisposition contentDisposition = new ContentDisposition("attachment; filename=image.jpg");
		
		return Response.ok(
			new StreamingOutput() {
				@Override
				public void write(OutputStream out) throws IOException, WebApplicationException {
					byte[] buffer = new byte[4 * 1024];
					int bytesRead;
					while ((bytesRead = input.read(buffer)) != -1) {
					//while ((bytesRead = bis.read(buffer)) != -1) {
						out.write(buffer, 0, bytesRead);
					}
					out.flush();
					out.close();
					input.close();
				}
			}
		).header("Content-Disposition", "attachment; filename=" + fileName).build();		
		
	}	

	@Override
	public Logger getLogger() {
		return logger;
	}    

}
