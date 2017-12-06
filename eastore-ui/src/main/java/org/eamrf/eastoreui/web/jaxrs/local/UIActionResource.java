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
import javax.ws.rs.QueryParam;
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
     * Create a new store
     * 
     * @param storeName - store name must be unique. an exception will be thrown if a store with
     * the provided name already exists.
     * @param storeDesc - store description
     * @param storePath - store path on the local file system. This application must have read/write
     * permission to create the directory.
     * @param maxFileSizeBytes - max file size in bytes allowed by the store for file storage in the
     * database in blob format (file will still be saved to the local file system.)
     * @param rootDirName - directory name for the root directory for the store.
     * @param rootDirDesc - description for the root directory
     * @param readGroup1 - required read access group
     * @param writeGroup1 - required write access group
     * @param executeGroup1 - required execute access group
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/addStore")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addStore(
    		@QueryParam("storeName") String storeName,
    		@QueryParam("storeDesc") String storeDesc,
    		@QueryParam("storePath") String storePath,
    		@QueryParam("maxFileSizeBytes") Long maxFileSizeBytes,
    		@QueryParam("rootDirName") String rootDirName,
    		@QueryParam("rootDirDesc") String rootDirDesc,
    		@QueryParam("readGroup1") String readGroup1,
    		@QueryParam("writeGroup1") String writeGroup1,
    		@QueryParam("executeGroup1") String executeGroup1) throws WebServiceException {
    	
    	if(maxFileSizeBytes == null || StringUtil.isNullEmpty(storeName) || StringUtil.isNullEmpty(storeDesc)
    			|| StringUtil.isNullEmpty(storePath) || StringUtil.isNullEmpty(rootDirName) ||
    			StringUtil.isNullEmpty(rootDirDesc) || StringUtil.isNullEmpty(readGroup1) ||
    			StringUtil.isNullEmpty(writeGroup1) || StringUtil.isNullEmpty(executeGroup1)){
    		
    		handleError("Missing required params. Please check, storeName, storeDesc, storePath, "
    				+ "maxFileSizeBytes, rootDirName, rootDirDesc, readGroup1, writeGroup1, and/or executeGroup1 values.", 
    				WebExceptionType.CODE_IO_ERROR);
    		
    	}
    	
    	// needs to be lowercase
    	//storePath = storePath.toLowerCase();
    	
    	String jsonResponse = null;
    	try {
	    	jsonResponse = uiService.createStore(storeName, storeDesc, storePath, rootDirName, rootDirDesc, maxFileSizeBytes, 
					readGroup1, writeGroup1, executeGroup1);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
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
    	
    	logger.info("Processing incoming upload");
    	
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
		
		logger.info(UIJsonResource.class.getSimpleName() + " downloadFileById(...) called");
		
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
	
	/**
	 * adds a new directory (via eastore)
	 * 
	 * @param dirNodeId - id of parent directory
	 * @param name - name of new directory
	 * @param desc - description for new directory
     * @param readGroup1 - optional read group
     * @param writeGroup1 - optional write group
     * @param executeGroup1 - optional execute group
	 * @return
	 * @throws WebServiceException
	 */
    @GET
    @Path("/addDirectory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addDirectory(
    		@QueryParam("dirNodeId") Long dirNodeId,
    		@QueryParam("name") String name,
    		@QueryParam("desc") String desc,
    		@QueryParam("readGroup1") String readGroup1,
    		@QueryParam("writeGroup1") String writeGroup1,
    		@QueryParam("executeGroup1") String executeGroup1) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " addDirectory(...) called");
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.addDirectory(dirNodeId, name, desc, readGroup1, writeGroup1, executeGroup1);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();    	
   
    }
    
    /**
     * Copy a file
     * 
     * @param fileNodeId - id of file to copy
     * @param dirNodeId - id of directory where file will be copied to
     * @param replaceExisting - pass true to replace any existing file with the same name (case insensitive match) in
     * the target directory. Pass false not to replace. If you pass false and a file does already exist, then
     * an exception will be thrown.
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/copyFile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response copyFile(
    		@QueryParam("fileNodeId") Long fileNodeId,
    		@QueryParam("dirNodeId") Long dirNodeId,
    		@QueryParam("replaceExisting") Boolean replaceExisting) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " copyFile(...) called");
    	
    	if(fileNodeId == null || dirNodeId == null || replaceExisting == null){
    		handleError("Cannot copy file, missing fileNodeId, dirNodeId, and/or replaceExisting params.", 
    				WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.copyFile(fileNodeId, dirNodeId, replaceExisting);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }

    /**
     * Copy a directory
     * 
     * @param copyDirNodeId
     * @param destDirNodeId
     * @param replaceExisting
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/copyDirectory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response copyDirectory(
    		@QueryParam("copyDirNodeId") Long copyDirNodeId,
    		@QueryParam("destDirNodeId") Long destDirNodeId,
    		@QueryParam("replaceExisting") Boolean replaceExisting) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " copyDirectory(...) called");
    	
    	if(copyDirNodeId == null || destDirNodeId == null || replaceExisting == null){
    		handleError("Missing copyDirNodeId, destDirNodeId, and/or replaceExisting params.", WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Move a file
     * 
     * @param fileNodeId - id of file to move
     * @param dirNodeId - id of directory where file will be moved to
     * @param replaceExisting - pass true to replace any existing file with the same name (case insensitive match) in
     * the target directory. Pass false not to replace. If you pass false and a file does already exist, then
     * an exception will be thrown.
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/moveFile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveFile(
    		@QueryParam("fileNodeId") Long fileNodeId,
    		@QueryParam("dirNodeId") Long dirNodeId,
    		@QueryParam("replaceExisting") Boolean replaceExisting) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " moveFile(...) called");
    	
    	if(fileNodeId == null || dirNodeId == null || replaceExisting == null){
    		handleError("Cannot move file, missing fileNodeId, dirNodeId, and/or replaceExisting params.", 
    				WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.moveFile(fileNodeId, dirNodeId, replaceExisting);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Move a directory
     * 
     * @param copyDirNodeId
     * @param destDirNodeId
     * @param replaceExisting
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/moveDirectory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response moveDirectory(
    		@QueryParam("moveDirNodeId") Long moveDirNodeId,
    		@QueryParam("destDirNodeId") Long destDirNodeId,
    		@QueryParam("replaceExisting") Boolean replaceExisting) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " moveFile(...) called");
    	
    	if(moveDirNodeId == null || destDirNodeId == null || replaceExisting == null){
    		handleError("Missing moveDirNodeId, destDirNodeId, and/or replaceExisting params.", WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Delete a file
     * 
     * @param fileNodeId
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/removeFile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeFile(@QueryParam("fileNodeId") Long fileNodeId) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " removeFile(...) called");
    	
    	if(fileNodeId == null){
    		handleError("Missing fileNodeId param.", WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.removeFile(fileNodeId);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }
    
    /**
     * Delete a directory
     * 
     * @param dirNodeId
     * @return
     * @throws WebServiceException
     */
    @POST
    @Path("/removeDirectory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeDirectory(@QueryParam("dirNodeId") Long dirNodeId) throws WebServiceException {
    	
    	logger.info(UIActionResource.class.getSimpleName() + " removeFile(...) called");
    	
    	if(dirNodeId == null){
    		handleError("Missing dirNodeId param.", WebExceptionType.CODE_IO_ERROR);
    	}
    	
    	String jsonResponse = null;
		try {
			jsonResponse = uiService.removeDirectory(dirNodeId);
		} catch (ServiceException e) {
			logger.error(e.getMessage(), e);
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, e.getMessage(), e);
		}
		
		return Response.ok(jsonResponse, MediaType.APPLICATION_JSON).build();
    	
    }    

	@Override
	public Logger getLogger() {
		return logger;
	}

}
