package org.eamrf.eastoreui.web.jaxrs.eastore.client;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import javax.activation.DataHandler;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.MultipartBody;
import org.apache.cxf.jaxrs.provider.MultipartProvider;
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
	 * @return
	 * @throws WebServiceException
	 */
	public String uploadFile(Long dirNodeId, String fileName, DataHandler dataHandler) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " uploadFile method");
		
		resetClient();
		
		final String fileAttachId = "file_0";
		final String dirIdAttachId = "dirId";
		
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
		
		atts.add(fileAttachment);
		atts.add(dirIdAttach);
		
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
	 * @return
	 * @throws WebServiceException
	 */
	public String addDirectory(Long dirNodeId, String dirName, String dirDesc) throws WebServiceException {
		
		logger.info("Calling " + EAStoreActionClient.class.getSimpleName() + " addDirectory method");
		
		resetClient();
		
		String path = "/fsys/action/addDirectory";
		client
			.path(path)
			.query("dirNodeId", dirNodeId)
			.query("name", dirName)
			.query("desc", dirDesc);
		
		// TODO - service method should be changed to POST
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;			
		
	}

}
