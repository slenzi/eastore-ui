/**
 * 
 */
package org.eamrf.eastoreui.core.service;

import javax.activation.DataHandler;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.model.file.FileResponse;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreJsonClient;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreActionClient;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreClientProvider;
import org.eamrf.web.rs.exception.WebServiceException;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for interacting with E-A Store JAX-RS Services
 * 
 * @author slenzi
 */
@Service
public class EAStoreService {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private EAStoreClientProvider eaStoreClientProvider;
	
	public EAStoreService() { }
	
	/**
	 * Call E-A Store echo test method
	 * 
	 * @param message
	 * @return
	 * @throws WebServiceException
	 */
	public String echo(String message) throws ServiceException {
		
		logger.info(EAStoreService.class.getSimpleName() + " echo() called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		try {
			return client.echo(message);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore echo, " + e.getMessage(), e);
		}
		
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
	 * @throws ServiceException
	 */
	public String uploadFile(Long dirNodeId, String fileName, DataHandler dataHandler) throws ServiceException {
		
		logger.info(EAStoreService.class.getSimpleName() + " uploadFile(...) called");
		
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		try {
			return client.uploadFile(dirNodeId, fileName, dataHandler);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore echo, " + e.getMessage(), e);
		}		
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/nodeId/{nodeId}
	 * 
	 * @param nodeId - the id of the path resource. If the ID is of a file meta resource the binary
	 * data for the file will not be inlcuded.
	 * @return
	 * @throws ServiceException
	 */
	public String getPathResourceById(Long nodeId) throws ServiceException {
		
		logger.info(EAStoreService.class.getSimpleName() + " getPathResourceById() called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		try {
			return client.getPathResourceById(nodeId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore getPathResourceById(), " + e.getMessage(), e);
		}
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @return
	 */
	public String getPathResourceByPath(String storeName, String relPath) throws ServiceException {

		logger.info(EAStoreService.class.getSimpleName() + " getPathResourceByPath(...) called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		try {
			return client.getPathResourceByPath(storeName, relPath);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore getPathResourceByPath(...), " + e.getMessage(), e);
		}		
		
	}	
	
	/**
	 * Calls E-A Store JSON service, /fys/json/store/name/{storeName}
	 * 
	 * @return
	 * @throws ServiceException
	 */
	public String getStoreByName(String storeName) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getStoreByName(storeName);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching store with name '" + storeName + "', " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}	
	
	/**
	 * Calls E-A Store JSON service, /fys/json/store
	 * 
	 * @return
	 * @throws ServiceException
	 */
	public String getStores() throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getStores();
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching stores, " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}	
	
	/**
	 * Calls E-A Store JSON service, getBreadcrumbsByNodeId(...) method
	 *
	 * @param nodeId - id of the path resource node
	 * @return - JSON array of path resources, first element being the root, and last element being the child most element.
	 * @throws ServiceException
	 */
	public String getBreadcrumbsByNodeId(Long nodeId) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getBreadcrumbsByNodeId(nodeId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching breadcrumbs, nodeId=" + 
					nodeId + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}
	
	/**
	 * Calls E-A Store JSON service, getBreadcrumbsByPath(...) method
	 *
	 * @param storeName - the name of the store
	 * @param relPath - the relative path of a resource within the source.
	 * @return - JSON array of path resources, first element being the root, and last element being the child most element.
	 * @throws ServiceException
	 */
	public String getBreadcrumbsByPath(String storeName, String relPath) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getBreadcrumbsByPath(storeName, relPath);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching breadcrumbs, store=" + 
					storeName + ", relPath=" + relPath + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}	
	
	/**
	 * Calls E-A Store JSON service, getChildPathResourceByPath(...) method
	 *
	 * @param storeName - the name of the store
	 * @param relPath - the relative path of a resource within the source.
	 * @return - JSON array, a listing of first-level child resource under resource with the provided 'relPath'
	 * @throws ServiceException
	 */
	public String getChildPathResourceByPath(String storeName, String relPath) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getChildPathResourceByPath(storeName, relPath);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching first-level child resources from eastore, store=" + 
					storeName + ", relPath=" + relPath + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}
	
	/**
	 * Calls E-A Store action service, downloadFile(...) method
	 * 
	 * @param fileNodeId - node id of the file meta resource to download
	 * @return
	 * @throws ServiceException
	 */
    public FileResponse getFileReponse(Long fileNodeId) throws ServiceException {
    	
    	EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
    	
    	FileResponse fresp = null;
    	try {
    		fresp = client.getFileReponse(fileNodeId);
		} catch (WebServiceException e) {
			if(fresp != null && fresp.hasInputStream()){
				fresp.close();
			}
			throw new ServiceException("Error getting file input stream, fileNodeId=" + 
					fileNodeId + ", " + e.getMessage(), e);
		}
    	return fresp;
    	
    }	


}
