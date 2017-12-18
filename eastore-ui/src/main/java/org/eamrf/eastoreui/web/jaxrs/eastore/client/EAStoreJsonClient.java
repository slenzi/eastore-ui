package org.eamrf.eastoreui.web.jaxrs.eastore.client;

import java.net.URI;
import java.util.Collections;

import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.client.WebClient;
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
		
		logger.debug("Initializing " + EAStoreJsonClient.class.getSimpleName());
		
		serviceUrl = url;
		serviceUsr = username;
		servicePwd = password;
		
		logger.debug("ea-store url = " + serviceUrl);
		logger.debug("ea-store usr = " + serviceUsr);
		logger.debug("ea-store pwd = " + "*********");
		
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
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " echo method");
		
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
	 * Call E-A Store /fsys/json/resource/userId/{userId}/nodeId/{nodeId}
	 * 
	 * @param nodeId - the id of the path resource. If the ID is of a file meta resource the binary
	 * data for the file will not be included.
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String getPathResourceById(Long nodeId, String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getPathResourceById method");
		
		resetClient();
		
		String path = "/fsys/json/resource/userId/ " + userId + "/nodeId/" + nodeId.toString();
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
	 * Call E-A Store /fsys/json/resource/userId/{userId}/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @param userId - id of user performing action
	 * @return
	 */
	public String getPathResourceByPath(String storeName, String relPath, String userId) throws WebServiceException {

		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getPathResourceByPath method");
		
		resetClient();
		
		if(!relPath.startsWith("/")){
			relPath = "/" + relPath;
		}
		
		String path = "/fsys/json/resource/userId/" + userId + "/path/" + storeName + relPath;
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
	 * @param userId - is of user completing the action
	 * @return
	 * @throws WebServiceException
	 */
	public String getStores(String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getStores method");
		
		resetClient();
		
		String path = "/fsys/json/store/userId/" + userId;
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
	 * Call E-A Store /fsys/json/store/userId/{userId}/name/{storeName}
	 * 
	 * @param userId - id of user completing the action.
	 * @return
	 * @throws WebServiceException
	 */
	public String getStoreByName(String storeName, String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getStoreByName method");
		
		resetClient();
		
		String path = "/fsys/json/store/userId/" + userId + "/name/" + storeName;
		client.path(path);
		Response resp = client.get();
		URI currentUri = client.getCurrentURI();
		logger.debug("Client URI = " + currentUri.toString());
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}	
	
	/**
	 * Call E-A Store /fsys/json/breadcrumb/userId/{userId}/nodeId/{nodeId}
	 * 
	 * @param nodeId - id of the path resource node
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String getBreadcrumbsByNodeId(Long nodeId, String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getBreadcrumbsByNodeId method");
		
		resetClient();
		
		String path = "/fsys/json/breadcrumb/userId/" + userId + "/nodeId/" + nodeId.toString();
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
	 * Call E-A Store /fsys/json/breadcrumb/path/userId/{userId}/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String getBreadcrumbsByPath(String storeName, String relPath, String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getBreadcrumbsByPath method");
		
		resetClient();
		
		String path = "/fsys/json/breadcrumb/path/userId/" + userId + "/" + storeName + "/" + relPath;
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
	 * Call E-A Store /fsys/json/child/resource/userId/{userId}/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @param userId - id of user performing action
	 * @return
	 * @throws WebServiceException
	 */
	public String getChildPathResourceByPath(String storeName, String relPath, String userId) throws WebServiceException {
		
		logger.debug("Calling " + EAStoreJsonClient.class.getSimpleName() + " getChildPathResourceByPath method");
		
		resetClient();
		
		String path = "/fsys/json/child/resource/userId/" + userId + "/path/" + storeName + "/" + relPath;
		client.path(path);
		Response resp = client.get();
		
		if(resp.getStatus() != Response.Status.OK.getStatusCode()){
			throw new WebServiceException(WebExceptionType.CODE_IO_ERROR, 
					"Response error from " + client.getCurrentURI().toString() + ", response code = " + resp.getStatus());
		}
		
		String responseString = resp.readEntity(String.class);
		
		return responseString;		
		
	}

}
