package org.eamrf.eastoreui.web.jaxrs.eastore.client;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;

import javax.activation.DataHandler;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.MultipartBody;
import org.apache.cxf.jaxrs.provider.MultipartProvider;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.model.file.FileResponse;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EAStoreActionClient {

    private Logger logger = LoggerFactory.getLogger(EAStoreJsonClient.class);
    
    private WebClient client = null;
    
    private String serviceUrl = null;
    private String serviceUsr = null;
    private String servicePwd = null;
    
    private final String SERVICE_PATH_PREFIX = "/easapi/v1";
	
	public EAStoreActionClient(String url, String username, String password) {
		initializeClient(url, username, password);
	}	
	
	private void initializeClient(String url, String username, String password) {
		
		logger.info("Initializing " + EAStoreJsonClient.class.getSimpleName());
		
		serviceUrl = url;
		serviceUsr = username;
		servicePwd = password;
		
		logger.info("ea-store url = " + serviceUrl);
		logger.info("ea-store usr = " + serviceUsr);
		logger.info("ea-store pwd = " + "*********");
		
		MultipartProvider multi = new MultipartProvider();
		
		if(serviceUsr.equals("") || servicePwd.equals("")){
			client = WebClient.create(serviceUrl, Collections.singletonList(multi), null);
		}else{
			client = WebClient.create(serviceUrl, Collections.singletonList(multi), serviceUsr, servicePwd, null);
		}
		
		client = client.accept("application/json").type("application/json");

	}
	
	private void resetClient(){
		
		// to reset path, use one of the following
		//client.back(true);
		//client.replacePath("/your/new/path");
		
		client.reset();
		client.resetQuery();
		
		client.back(true);
		client.path(SERVICE_PATH_PREFIX);
		
	}	
	
	/**
	 * Call E-A Store /fsys/action/uploadFile
	 * 
	 * Uploads a file to eastore, to the specified directory
	 * 
	 * @param dirNodeId - id of the directory node
	 * @param fileName - file name
	 * @param dataHandler - interface to the binary data for the file
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String uploadFile(Long dirNodeId, String fileName, DataHandler dataHandler, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " uploadFile method");
		
		resetClient();
		
		final String fileAttachId = "file_0";
		final String dirIdAttachId = "dirId";
		final String userIdAttachId = "userId";
		
		String path = "/fsys/action/uploadFile";
		client.path(path);
		client.encoding("UTF-8");
		client.type(MediaType.MULTIPART_FORM_DATA);
		
		List<Attachment> atts = new LinkedList<Attachment>();
		
		// add 'file_0' attachment
		Attachment fileAttachment = null;
		try {
			fileAttachment = new Attachment(
					fileAttachId,
					dataHandler.getInputStream(),
					new ContentDisposition("attachment;filename=" + fileName));
		} catch (IOException e) {
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR,
					"Failed to create file_0 attachment, " + e.getMessage(), e);
		}
		
		// add 'dirId' attachment
		Attachment dirIdAttach = new Attachment(
				dirIdAttachId,
				new ByteArrayInputStream(String.valueOf(dirNodeId).getBytes()),
				new ContentDisposition("form-data; name=\"" + dirIdAttachId + "\";"));
		
		// add 'userId' attachment
		Attachment userIdAttach = new Attachment(
				userIdAttachId,
				new ByteArrayInputStream(userId.getBytes()),
				new ContentDisposition("form-data; name=\"" + userIdAttachId + "\";"));		
		
		atts.add(fileAttachment);
		atts.add(dirIdAttach);
		atts.add(userIdAttach);
		
		MultipartBody body = new MultipartBody(atts);
		
		Response resp = client.post(body);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
				"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}		
	
		return "";
		
	}
	
	/**
	 * Call E-A Store /fsys/action/addDirectory
	 * 
	 * @param dirNodeId - id of parent directory. the new directory will be created under this directory
	 * @param dirName - name of new directory
	 * @param dirDesc - description for new directory
	 * @param readGroup1 - optional read group
	 * @param writeGroup1 - optional write group
	 * @param executeGroup1 - optional execute group
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String addDirectory(
			Long dirNodeId, 
			String dirName, 
			String dirDesc, 
			String readGroup1, 
			String writeGroup1, 
			String executeGroup1, 
			String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " addDirectory method");
		
		resetClient();
		
		String path = "/fsys/action/addDirectory";
		client
			.path(path)
			.query("dirNodeId", dirNodeId)
			.query("name", dirName)
			.query("desc", dirDesc)
			.query("userId", userId);
		
		// read, write, and execute groups are optional
		if(readGroup1 != null) {
			client.query("readGroup1", readGroup1);
		}
		if(writeGroup1 != null) {
			client.query("writeGroup1", writeGroup1);
		}
		if(executeGroup1 != null) {
			client.query("executeGroup1", executeGroup1);
		}
			
		
		// TODO - service method should be changed to POST
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;			
		
	}
	
	/**
	 * Update a directory
	 * 
	 * @param dirNodeId - id of directory to update
	 * @param dirName - new name
	 * @param dirDesc - new desc
	 * @param readGroup1 - optional read group
	 * @param writeGroup1 - optional write group
	 * @param executeGroup1 - optional execute group
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String updateDirectory(
			Long dirNodeId, 
			String dirName, 
			String dirDesc, 
			String readGroup1, 
			String writeGroup1, 
			String executeGroup1, 
			String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " updateDirectory method");
		
		resetClient();
		
		String path = "/fsys/action/updateDirectory";
		client
			.path(path)
			.query("dirNodeId", dirNodeId)
			.query("name", dirName)
			.query("desc", dirDesc)
			.query("userId", userId);
		
		// read, write, and execute groups are optional
		if(readGroup1 != null) {
			client.query("readGroup1", readGroup1);
		}
		if(writeGroup1 != null) {
			client.query("writeGroup1", writeGroup1);
		}
		if(executeGroup1 != null) {
			client.query("executeGroup1", executeGroup1);
		}
			
		Response resp = client.post("");
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;			
		
	}	
	
	/**
	 * Call E-A Store /fsys/action/copyFile
	 * 
	 * @param fileNodeId
	 * @param dirNodeId
	 * @param replaceExisting
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String copyFile(Long fileNodeId, Long dirNodeId, Boolean replaceExisting, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " copyFile(...) method");
		
		resetClient();
		
		String path = "/fsys/action/copyFile";
		
		client
			.path(path)
			.query("fileNodeId", fileNodeId)
			.query("dirNodeId", dirNodeId)
			.query("replaceExisting", replaceExisting)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/copyDirectory
	 * 
	 * @param copyDirNodeId
	 * @param destDirNodeId
	 * @param replaceExisting
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String copyDirectory(Long copyDirNodeId, Long destDirNodeId, Boolean replaceExisting, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " copyDirectory(...) method");
		
		resetClient();
		
		String path = "/fsys/action/copyDirectory";
		
		client
			.path(path)
			.query("copyDirNodeId", copyDirNodeId)
			.query("destDirNodeId", destDirNodeId)
			.query("replaceExisting", replaceExisting)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/moveFile
	 * 
	 * @param fileNodeId
	 * @param dirNodeId
	 * @param replaceExisting
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String moveFile(Long fileNodeId, Long dirNodeId, Boolean replaceExisting, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " moveFile(...) method");
		
		resetClient();
		
		String path = "/fsys/action/moveFile";
		
		client
			.path(path)
			.query("fileNodeId", fileNodeId)
			.query("dirNodeId", dirNodeId)
			.query("replaceExisting", replaceExisting)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/moveDirectory
	 * 
	 * @param moveDirNodeId
	 * @param destDirNodeId
	 * @param replaceExisting
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String moveDirectory(Long moveDirNodeId, Long destDirNodeId, Boolean replaceExisting, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " moveDirectory(...) method");
		
		resetClient();
		
		String path = "/fsys/action/moveDirectory";
		
		client
			.path(path)
			.query("moveDirNodeId", moveDirNodeId)
			.query("destDirNodeId", destDirNodeId)
			.query("replaceExisting", replaceExisting)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/removeFile
	 * 
	 * @param fileNodeId
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String removeFile(Long fileNodeId, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " removeFile(...) method");
		
		resetClient();
		
		String path = "/fsys/action/removeFile";
		
		client
			.path(path)
			.query("fileNodeId", fileNodeId)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/removeDirectory
	 * 
	 * @param dirNodeId
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String removeDirectory(Long dirNodeId, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " removeDirectory(...) method");
		
		resetClient();
		
		String path = "/fsys/action/removeDirectory";
		
		client
			.path(path)
			.query("dirNodeId", dirNodeId)
			.query("userId", userId);
		
		Response resp = client.post(null);
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/download/userId/{userId}/id/{fileId}
	 * 
	 * @param fileId
	 * @param userId - id of user performing action
	 * @throws WebServiceException
	 */
	public FileResponse getFileReponse(Long fileId, String userId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getFile method");
		
		resetClient();
		
		String path = "/fsys/action/download/userId/" + userId + "/id/" + String.valueOf(fileId.longValue());
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}

		logResponseHeaders(resp);
		
		InputStream inStream = resp.readEntity(InputStream.class);
		
		FileResponse fresp = new FileResponse();
		fresp.setName(getContentDispositionFileName(resp));
		fresp.setInput(inStream);
		
		return fresp;
	
	}
	
	/**
     * Call E-A store /fsys/action/addStore
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
	 */
	public String addStore(
			String storeName,
			String storeDesc, 
			String storePath, 
			String rootDirName, 
			String rootDirDesc,
			Long maxFileSizeBytes, 
			String readGroup1, 
			String writeGroup1, 
			String executeGroup1) throws WebServiceException {

		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " addStore method");
		
		resetClient();
		
		String path = "/fsys/action/addStore";
		client
			.path(path)
			.query("storeName", storeName)
			.query("storeDesc", storeDesc)
			.query("storePath", storePath)
			.query("maxFileSizeBytes", maxFileSizeBytes)
			.query("rootDirName", rootDirName)
			.query("rootDirDesc", rootDirDesc)
			.query("readGroup1", readGroup1)
			.query("writeGroup1", writeGroup1)
			.query("executeGroup1", executeGroup1);
		
		Response resp = client.post("");
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Parse the file name from the Content-Disposition header
	 * 
	 * @param resp
	 * @return
	 */
	private String getContentDispositionFileName(Response resp){
		MultivaluedMap<String, String> headers = resp.getStringHeaders();
		Set<Entry<String, List<String>>> entries = headers.entrySet();
		for(Entry<String, List<String>> ent : entries){
			if(ent.getKey().toLowerCase().equals("content-disposition")){
				String val = StringUtil.changeNull(ent.getValue().get(0));
				return val.substring(val.lastIndexOf("filename=") + "filename=".length());
			}
		}
		return "unknown_file_name";
	}

	/**
	 * Log response headers
	 * 
	 * @param resp
	 */
	private void logResponseHeaders(Response resp){
		logger.info("Response Length=" + resp.getLength());
		MultivaluedMap<String, String> headers = resp.getStringHeaders();
		Set<Entry<String, List<String>>> entries = headers.entrySet();
		for(Entry<String, List<String>> ent : entries){
			logger.info("Header=" + ent.getKey());
			for(String value : ent.getValue()){
				logger.info(" Value=" + value);
			}
		}
	}	

}
