/**
 * 
 */
package org.eamrf.eastore.ui.core.service;

import java.util.List;
import java.util.StringJoiner;

import javax.activation.DataHandler;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.client.jaxrs.v1.EAStoreActionClient;
import org.eamrf.eastore.client.jaxrs.v1.EAStoreJsonClient;
import org.eamrf.eastore.client.jaxrs.v1.EAStoreTreeClient;
import org.eamrf.eastore.client.model.file.FileResponse;
import org.eamrf.eastore.ui.core.aop.profiler.MethodTimer;
import org.eamrf.eastore.ui.web.jaxrs.eastore.provider.EAStoreClientProvider;
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
public class StoreService {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private EAStoreClientProvider eaStoreClientProvider;
    
    @Autowired
    private AuthenticationService authService;    
	
	public StoreService() { }
	
	/**
	 * Call E-A Store echo test method
	 * 
	 * @param message
	 * @return
	 * @throws WebServiceException
	 */
	public String echo(String message) throws ServiceException {
		
		logger.debug(StoreService.class.getSimpleName() + " echo() called");
		
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
    	
    	logger.debug(StoreService.class.getSimpleName() + " addDirectory(...) called");
    	
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = authService.getUserId();
		
		try {
			return client.addDirectory(dirNodeId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore addDirectory(...), " + e.getMessage(), e);
		}    	
    	
    }
    
    /**
     * Update a file
     * 
     * @param fileNodeId - id of file to update
	 * @param fileName - new name for file
	 * @param fileDesc - new description for file
     * @return
     * @throws ServiceException
     */
    public String updateFile(Long fileNodeId, String fileName, String fileDesc) throws ServiceException {
    	
    	logger.debug(StoreService.class.getSimpleName() + " updateFile(...) called");
    	
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = authService.getUserId();
		
		try {
			return client.updateFile(fileNodeId, fileName, fileDesc, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore updateFile(...), " + e.getMessage(), e);
		}    	
    	
    }     
    
    /**
     * Update a directory
     * 
     * @param dirNodeId - id of directory to update
	 * @param dirName - new name for directory
	 * @param dirDesc -  new description for directory
     * @param readGroup1 - optional read group
     * @param writeGroup1 - optional write group
     * @param executeGroup1 - optional execute group
     * @return
     * @throws ServiceException
     */
    public String updateDirectory(Long dirNodeId, String dirName, String dirDesc, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {
    	
    	logger.debug(StoreService.class.getSimpleName() + " updateDirectory(...) called");
    	
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = authService.getUserId();
		
		try {
			return client.updateDirectory(dirNodeId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore updateDirectory(...), " + e.getMessage(), e);
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
    @MethodTimer
	public String uploadFile(Long dirNodeId, String fileName, DataHandler dataHandler) throws ServiceException {
		
		logger.debug(StoreService.class.getSimpleName() + " uploadFile(...) called");
		
		EAStoreActionClient client = eaStoreClientProvider.getActionClient();
		
		String userId = authService.getUserId();
		
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
		
		logger.debug(StoreService.class.getSimpleName() + " getPathResourceById(...) called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = authService.getUserId();
		
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

		logger.debug(StoreService.class.getSimpleName() + " getPathResourceByPath(...) called");
		
		EAStoreJsonClient client = eaStoreClientProvider.getJsonClient();
		
		String userId = authService.getUserId();
		
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
		
		String userId = authService.getUserId();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getStoreByName(storeName, userId);
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
		
		String userId = authService.getUserId();
		
    	String jsonResponse = null;
    	try {
    		jsonResponse = client.getStores(userId);
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
		
		String userId = authService.getUserId();
		
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
		
		String userId = authService.getUserId();
		
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
		
		String userId = authService.getUserId();
		
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
	 * Download resource logged in download table
	 * 
	 * Calls E-A Store action service, /fsys/action/download/downloadId/{downloadId}/userId/{userId}
	 * 
	 * @param downloadId - unique download id
	 * @return
	 * @throws ServiceException
	 */
    public FileResponse getDownload(Long downloadId) throws ServiceException {
    	
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = authService.getUserId();
    	
    	FileResponse fresp = null;
    	try {
    		fresp = client.getDownload(downloadId, userId);
		} catch (WebServiceException e) {
			if(fresp != null && fresp.hasInputStream()){
				fresp.close();
			}
			throw new ServiceException("Error getting file input stream for download log entry, downloadId=" + 
					downloadId + ", " + e.getMessage(), e);
		}
    	return fresp;
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
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
    	
    	String userId = authService.getUserId();
    	
		try {
			return client.removeDirectory(dirNodeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore removeDirectory(...), " + e.getMessage(), e);
		}     	
    	
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
	public String addStore(String storeName, String storeDesc, String storePath, String rootDirName,
			String rootDirDesc, Long maxFileSizeBytes, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {

    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = authService.getUserId();
    	
    	// TODO - check for user permission to add store?
    	
		try {
			return client.addStore(storeName, storeDesc, storePath, rootDirName, rootDirDesc,
					maxFileSizeBytes, readGroup1, writeGroup1, executeGroup1);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore addStore(...), " + e.getMessage(), e);
		} 		
		
	}
	
    /**
     * Call E-A store /fsys/action/updateStore
     * 
     * @param storeId - id of store to update
     * @param storeName - store name must be unique. an exception will be thrown if a store with
     * the provided name already exists.
     * @param storeDesc - store description
     * @param rootDirName - directory name for the root directory for the store.
     * @param rootDirDesc - description for the root directory
     * @param rootDirReadGroup1 - required read access group
     * @param rootDirWriteGroup1 - required write access group
     * @param rootDirExecuteGroup1 - required execute access group
     * @return
     */
	public String updateStore(
			Long storeId,
			String storeName,
			String storeDesc,
			String rootDirName,
			String rootDirDesc,
			String rootDirReadGroup1,
			String rootDirWriteGroup1,
			String rootDirExecuteGroup1) throws ServiceException {

    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = authService.getUserId();
    	
    	// TODO - check for user permission to update store?
    	
		try {
			return client.updateStore(storeId, storeName, storeDesc, rootDirName, rootDirDesc, 
					rootDirReadGroup1, rootDirWriteGroup1, rootDirExecuteGroup1, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error calling eastore addStore(...), " + e.getMessage(), e);
		} 		
		
	}
	
	/**
	 * Fetch a text/html tree representation for the directory. 
	 * 
	 * @param dirId
	 * @return
	 * @throws ServiceException
	 */
	public String getPathResourceDownloadTree(Long dirId) throws ServiceException {
		
		EAStoreTreeClient client = eaStoreClientProvider.getTreeClient();
		
		String userId = authService.getUserId();
		
    	String htmlResponse = null;
    	try {
    		htmlResponse = client.getPathResourceDownloadTree(dirId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching download html tree, dirId=" + 
					dirId + ", userId=" + userId + ", " + e.getMessage(), e);
		}
    	
    	return htmlResponse;		
		
	}

	/**
     * Trigger process which rebuilds search (Lucene) index for store
     * 
     * @param storeId - ID of store
	 * @return
	 */
	public String rebuildStoreIndex(Long storeId) throws ServiceException {

    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = authService.getUserId();
    	
    	String htmlResponse = null;
    	try {
    		htmlResponse = client.rebuildStoreIndex(storeId, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error triggering process to rebuild store search index, storeId=" + 
					storeId + ", userId=" + userId + ", " + e.getMessage(), e);
		}
    	
    	return htmlResponse;    	
		
	}
	
	/**
	 * Trigger process for zip-download
	 * 
	 * @param resourceIds - IDs of all resources (file meta and directory) to zip for download
	 * @return
	 * @throws ServiceException
	 */
	public String triggerZipDownload(List<Long> resourceIds) throws ServiceException {
		
    	EAStoreActionClient client = eaStoreClientProvider.getActionClient();
    	
    	String userId = authService.getUserId();		
		
    	String htmlResponse = null;
    	try {
    		htmlResponse = client.triggerZipDownload(resourceIds, userId);
		} catch (WebServiceException e) {
			StringJoiner joiner = new StringJoiner(",","[","]");
			for(Long id : resourceIds) {
				joiner.add(String.valueOf(id));
			}
			throw new ServiceException("Error triggering process to create zip-download, userId=" + 
					userId + ", resourceIds=" + joiner.toString() + ", " + e.getMessage(), e);
		}
    	
    	return htmlResponse;      	
    	
	}
    
}
