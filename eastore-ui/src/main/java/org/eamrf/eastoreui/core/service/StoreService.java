/**
 * 
 */
package org.eamrf.eastoreui.core.service;

import javax.activation.DataHandler;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.model.file.FileResponse;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreJsonClient;
import org.eamrf.eastoreui.web.security.provider.AuthWorldUserProvider;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreActionClient;
import org.eamrf.eastoreui.web.jaxrs.eastore.client.EAStoreClientProvider;
import org.eamrf.web.rs.exception.WebServiceException;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for interacting with E-A Store JAX-RS Services
 * 
 * @author slenzi
 */
@Service
public class StoreService {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private EAStoreClientProvider eaStoreClientProvider;
    
    @Autowired
    private AuthWorldUserProvider authworldUserProvider;    
	
	public StoreService() { }
	
	/**
	 * Fetch the NCI MD Number (aka CTEP ID) from the currently logged in AuthWorld user.
	 * 
	 * @return
	 * @throws ServiceException
	 */
	private String getLoggedInUserId() throws ServiceException {
		
		AuthWorldUser user = authworldUserProvider.getUser();
		if(user == null) {
			throw new ServiceException("No AuthWorld user in the session");
		}
		String ctepId = user.getNciMdNum();
		if(StringUtil.isNullEmpty(ctepId)) {
			throw new ServiceException("Currently logged in AuthWorld user has a null or empty CTEP ID (ncimdnum)");
		}
		
		return user.getNciMdNum();
		
	}
	
	/**
	 * Call E-A Store echo test method
	 * 
	 * @param message
	 * @return
	 * @throws WebServiceException
	 */
	public String echo(String message) throws ServiceException {
		
		logger.info(StoreService.class.getSimpleName() + " echo() called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		try {
			return client.echo(message);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore echo(), " + e.getMessage(), e);
		}
		
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
	 * @return
	 * @throws ServiceException
	 */
    public String addDirectory(Long dirNodeId, String dirName, String dirDesc, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {
    	
    	logger.info(StoreService.class.getSimpleName() + " addDirectory(...) called");
    	
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = getLoggedInUserId();
		
		try {
			return client.addDirectory(dirNodeId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore addDirectory(...), " + e.getMessage(), e);
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
		
		logger.info(StoreService.class.getSimpleName() + " uploadFile(...) called");
		
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = getLoggedInUserId();
		
		try {
			return client.uploadFile(dirNodeId, fileName, dataHandler, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore uploadFile(...), " + e.getMessage(), e);
		}		
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/userId/{userId}/nodeId/{nodeId}
	 * 
	 * @param nodeId - the id of the path resource. If the ID is of a file meta resource the binary
	 * data for the file will not be inlcuded.
	 * @return
	 * @throws ServiceException
	 */
	public String getPathResourceById(Long nodeId) throws ServiceException {
		
		logger.info(StoreService.class.getSimpleName() + " getPathResourceById(...) called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = getLoggedInUserId();
		
		try {
			return client.getPathResourceById(nodeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore getPathResourceById(...), " + e.getMessage(), e);
		}
		
	}
	
	/**
	 * Call E-A Store /fsys/json/resource/userId/{userId}/path/{storeName}/{relPath:.+}
	 * 
	 * @param storeName
	 * @param relPath
	 * @return
	 */
	public String getPathResourceByPath(String storeName, String relPath) throws ServiceException {

		logger.info(StoreService.class.getSimpleName() + " getPathResourceByPath(...) called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = getLoggedInUserId();
		
		try {
			return client.getPathResourceByPath(storeName, relPath, userId);
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
	 * Calls E-A Store JSON service, /fsys/json/breadcrumb/userId/{userId}/nodeId/{nodeId}
	 *
	 * @param nodeId - id of the path resource node
	 * @return - JSON array of path resources, first element being the root, and last element being the child most element.
	 * @throws ServiceException
	 */
	public String getBreadcrumbsByNodeId(Long nodeId) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = getLoggedInUserId();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getBreadcrumbsByNodeId(nodeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching breadcrumbs, nodeId=" + 
					nodeId + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}
	
	/**
	 * Calls E-A Store JSON service, /fsys/json/breadcrumb/path/userId/{userId}/{storeName}/{relPath:.+}
	 *
	 * @param storeName - the name of the store
	 * @param relPath - the relative path of a resource within the source.
	 * @return - JSON array of path resources, first element being the root, and last element being the child most element.
	 * @throws ServiceException
	 */
	public String getBreadcrumbsByPath(String storeName, String relPath) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = getLoggedInUserId();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getBreadcrumbsByPath(storeName, relPath, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching breadcrumbs, store=" + 
					storeName + ", relPath=" + relPath + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}	
	
	/**
	 * Calls E-A Store JSON service, /fsys/json/child/resource/userId/{userId}/path/{storeName}/{relPath:.+}
	 *
	 * @param storeName - the name of the store
	 * @param relPath - the relative path of a resource within the source.
	 * @return - JSON array, a listing of first-level child resource under resource with the provided 'relPath'
	 * @throws ServiceException
	 */
	public String getChildPathResourceByPath(String storeName, String relPath) throws ServiceException {
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = getLoggedInUserId();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getChildPathResourceByPath(storeName, relPath, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching first-level child resources from eastore, store=" + 
					storeName + ", relPath=" + relPath + ", " + e.getMessage(), e);
		}
    	
    	return jsonResponse;
		
	}
	
	/**
	 * Calls E-A Store action service, /fsys/action/download/userId/{userId}/id/{fileId}
	 * 
	 * @param fileNodeId - node id of the file meta resource to download
	 * @return
	 * @throws ServiceException
	 */
    public FileResponse getFileReponse(Long fileNodeId) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
    	FileResponse fresp = null;
    	try {
    		fresp = client.getFileReponse(fileNodeId, userId);
		} catch (WebServiceException e) {
			if(fresp != null && fresp.hasInputStream()){
				fresp.close();
			}
			throw new ServiceException("Error getting file input stream, fileNodeId=" + 
					fileNodeId + ", " + e.getMessage(), e);
		}
    	return fresp;
    	
    }
    
    /**
     * Call E-A Store /fsys/action/copyFile
     * 
     * @param fileNodeId
     * @param dirNodeId
     * @param replaceExisting
     * @return
     * @throws ServiceException
     */
    public String copyFile(Long fileNodeId, Long dirNodeId, Boolean replaceExisting) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.copyFile(fileNodeId, dirNodeId, replaceExisting, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore copyFile(...), " + e.getMessage(), e);
		}    	
    	
    }
    
    /**
     * Call E-A Store /fsys/action/copyDirectory
     * 
     * @param copyDirNodeId
     * @param destDirNodeId
     * @param replaceExisting
     * @return
     * @throws ServiceException
     */
    public String copyDirectory(Long copyDirNodeId, Long destDirNodeId, Boolean replaceExisting) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore copyDirectory(...), " + e.getMessage(), e);
		}     	
    	
    }
    
    /**
     * Call E-A Store /fsys/action/moveFile
     * 
     * @param fileNodeId
     * @param dirNodeId
     * @param replaceExisting
     * @return
     * @throws ServiceException
     */
    public String moveFile(Long fileNodeId, Long dirNodeId, Boolean replaceExisting) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.moveFile(fileNodeId, dirNodeId, replaceExisting, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore moveFile(...), " + e.getMessage(), e);
		}    	
    	
    }
    
    /**
     * Call E-A Store /fsys/action/moveDirectory
     * 
     * @param moveDirNodeId
     * @param destDirNodeId
     * @param replaceExisting
     * @return
     * @throws ServiceException
     */
    public String moveDirectory(Long moveDirNodeId, Long destDirNodeId, Boolean replaceExisting) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore moveDirectory(...), " + e.getMessage(), e);
		}     	
    	
    }
    
    /**
     * Call E-A Store /fsys/action/removeFile
     * 
     * @param fileNodeId
     * @return
     * @throws ServiceException
     */
    public String removeFile(Long fileNodeId) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.removeFile(fileNodeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore removeFile(...), " + e.getMessage(), e);
		}    	
    	
    }

    /**
     * Call E-A Store /fsys/action/removeDirectory
     * 
     * @param dirNodeId
     * @return
     * @throws ServiceException
     */
    public String removeDirectory(Long dirNodeId) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = getLoggedInUserId();
    	
		try {
			return client.removeDirectory(dirNodeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore removeDirectory(...), " + e.getMessage(), e);
		}     	
    	
    }
    
}
