package org.eamrf.eastoreui.web.jaxrs.eastore.client;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.model.file.FileResponse;
import org.eamrf.web.rs.exception.WebServiceException;
import org.eamrf.web.rs.exception.WebServiceException.WebExceptionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;

/**
 * E-A Store JAX-RS client
 * 
 * @author slenzi
 */
public class EAStoreJsonClient {

    private Logger logger = LoggerFactory.getLogger(EAStoreJsonClient.class);
    
    private WebClient client = null;
    
    private String serviceUrl = null;
    private String serviceUsr = null;
    private String servicePwd = null;
    
    private final String SERVICE_PATH_PREFIX = "/easapi/v1";
	
	public EAStoreJsonClient(String url, String username, String password) {
		initializeClient(url, username, password);
	}
	
	/**
	 * Initialize the web client
	 * 
	 * @param url
	 * @param username
	 * @param password
	 */
	private void initializeClient(String url, String username, String password) {
		
		logger.info("Initializing " + EAStoreJsonClient.class.getSimpleName());
		
		serviceUrl = url;
		serviceUsr = username;
		servicePwd = password;
		
		logger.info("ea-store url = " + serviceUrl);
		logger.info("ea-store usr = " + serviceUsr);
		logger.info("ea-store pwd = " + "*********");
		
		JacksonJsonProvider json = new JacksonJsonProvider();
		
		if(serviceUsr.equals("") || servicePwd.equals("")){
			client = WebClient.create(serviceUrl, Collections.singletonList(json), null);
		}else{
			client = WebClient.create(serviceUrl, Collections.singletonList(json), serviceUsr, servicePwd, null);
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
	 * Call E-A Store /test/echo resource
	 * 
	 * @param message
	 * @return
	 */
	public String echo(String message) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " echo method");
		
		resetClient();
		
		String path = "/test/echo";
		client.path(path).query("message", message);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/nodeId/{nodeId}
	 * 
	 * @param nodeId - the id of the path resource. If the ID is of a file meta resource the binary
	 * data for the file will not be inlcuded.
	 * @return
	 * @throws WebServiceException
	 */
	public String getPathResourceById(Long nodeId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getPathResourceById method");
		
		resetClient();
		
		String path = "/fsys/json/resource/nodeId/" + nodeId.toString();
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @return
	 */
	public String getPathResourceByPath(String storeName, String relPath) throws WebServiceException {

		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getPathResourceByPath method");
		
		resetClient();
		
		if(!relPath.startsWith("/")){
			relPath = "/" + relPath;
		}
		
		String path = "/fsys/json/resource/path/" + storeName + relPath;
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Call E-A Store /fsys/json/store
	 * 
	 * @return
	 * @throws WebServiceException
	 */
	public String getStores() throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getStores method");
		
		resetClient();
		
		String path = "/fsys/json/store";
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/json/store/name/{storeName}
	 * 
	 * @return
	 * @throws WebServiceException
	 */
	public String getStoreByName(String storeName) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getStoreByName method");
		
		resetClient();
		
		String path = "/fsys/json/store/name/" + storeName;
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Call E-A Store /fsys/json/breadcrumb/nodeId/{nodeId}
	 * 
	 * @param nodeId - id of the path resource node
	 * @return
	 * @throws WebServiceException
	 */
	public String getBreadcrumbsByNodeId(Long nodeId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getBreadcrumbsByNodeId method");
		
		resetClient();
		
		String path = "/fsys/json/breadcrumb/nodeId/" + nodeId.toString();
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Call E-A Store /fsys/json/breadcrumb/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @return
	 * @throws WebServiceException
	 */
	public String getBreadcrumbsByPath(String storeName, String relPath) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getBreadcrumbsByPath method");
		
		resetClient();
		
		String path = "/fsys/json/breadcrumb/path/" + storeName + "/" + relPath;
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Call E-A Store /fsys/json/child/resource/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @return
	 * @throws WebServiceException
	 */
	public String getChildPathResourceByPath(String storeName, String relPath) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getChildPathResourceByPath method");
		
		resetClient();
		
		String path = "/fsys/json/child/resource/path/" + storeName + "/" + relPath;
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}
	
	/**
	 * Call E-A Store /fsys/action/download/id/{fileId}
	 * 
	 * @param fileId
	 * @throws WebServiceException
	 */
	public FileResponse getFileReponse(Long fileId) throws WebServiceException {
		
		logger.info("Calling " + EAStoreJsonClient.class.getSimpleName() + " getFile method");
		
		resetClient();
		
		String path = "/fsys/action/download/id/" + String.valueOf(fileId.longValue());
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
