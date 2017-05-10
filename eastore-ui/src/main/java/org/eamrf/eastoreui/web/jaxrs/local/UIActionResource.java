package org.eamrf.eastoreui.web.jaxrs.local;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.activation.DataHandler;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.MultipartBody;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.StringUtil;
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
 * jax-rs resource responsible for handling various events trigger from our front-end (javascript/angular UI)
 * 
 * @author slenzi
 */
@Path("/ui/action")
@Service("uiActionResource")
public class UIActionResource extends BaseResourceHandler {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private UIService uiService;    
	
	public UIActionResource() {
		
	}
	
	/**
	 * Processes the uploaded file and forwards it to eastore
	 * 
	 * @param body
	 * @return
	 * @throws WebServiceException
	 */
    @POST
    @Path("/uploadFile")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response addFile(MultipartBody body) throws WebServiceException {
    	
    	List<Attachment> attachments = body.getAllAttachments();
    	Attachment rootAttachement = body.getRootAttachment();
    	
    	// check if we actually have a multipart/form-data attachment for param 'file_0'
    	Attachment fileAttachment = body.getAttachment("file_0");
    	if(fileAttachment == null){
    		handleError("Error, no 'file_0' multipart/form-data attachement found in request",
    				WebExceptionType.CODE_IO_ERROR);
    	}
    	ContentDisposition cd = fileAttachment.getContentDisposition();
    	if (cd == null || cd.getParameter("filename") == null) {
    		handleError("Could not pull file name from content disposition", WebExceptionType.CODE_IO_ERROR);
    	}
    	String fileName = cd.getParameter("filename");
    	DataHandler dataHandler = fileAttachment.getDataHandler();    	
    	
    	// check for additional upload parameters
    	String storeId = getStringValue("storeId", body);
    	String dirNodeId = getStringValue("dirNodeId", body);
    	
    	if(StringUtil.isNullEmpty(storeId) || StringUtil.isNullEmpty(dirNodeId)){
    		handleError("Error, missing 'storeId' and/or 'dirNodeId' parameters in request. These values are required.",
    				WebExceptionType.CODE_IO_ERROR);    		
    	}
    	
    	Long lStoreId = -1L;
    	Long lDirNodeId = -1L;
    	try {
			lStoreId = Long.valueOf(storeId);
			lDirNodeId = Long.valueOf(dirNodeId);
		} catch (NumberFormatException e) {
    		handleError("Error converting 'storeId' and/or 'dirNodeId' parameters to type Long. Please check their values.",
    				WebExceptionType.CODE_IO_ERROR, e);
		}
    	
    	try {
			uiService.forwardUpload(lStoreId, lDirNodeId, fileName, dataHandler);
		} catch (ServiceException e) {
    		handleError("Error submitting upload to eastore. Store id = " + lStoreId.longValue() + 
    				", dirNodeId = " + lDirNodeId.longValue() + ", file name = " + fileName + ", " + e.getMessage(),
    				WebExceptionType.CODE_IO_ERROR, e);
		}
    	
    	return Response.ok("File processed").build();
    	
    }
    
    /**
     * Fetch a string value from the multipart body
     * 
     * @param key - the attribute name from the request
     * @param body - the multipartbody
     * @return
     */
    private String getStringValue(String key, MultipartBody body) {
    	
    	Attachment att = body.getAttachment(key);
    	if(att == null){
    		return null;
    	}
    	return att.getObject(String.class);
    	
    }    
	
	/**
	 * Download file
	 * 
	 * @param fileId
	 * @return
	 * @throws WebServiceException
	 */
	@GET
	@Path("/download/id/{fileId}")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadFileById(@PathParam("fileId") Long fileId) throws WebServiceException {
		
		logger.info(UIJsonResource.class.getSimpleName() + " downloadFileById() called");
		
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
