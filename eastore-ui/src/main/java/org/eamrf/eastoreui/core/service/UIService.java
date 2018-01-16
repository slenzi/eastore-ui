package org.eamrf.eastoreui.core.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.activation.DataHandler;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.aop.profiler.MethodTimer;
import org.eamrf.eastoreui.core.exception.ServiceException;
import org.eamrf.eastoreui.core.model.file.FileResponse;
import org.eamrf.eastoreui.core.service.security.GatekeeperService;
import org.eamrf.eastoreui.web.security.provider.AuthWorldUserProvider;
import org.eamrf.gatekeeper.web.service.jaxws.model.Category;
import org.eamrf.gatekeeper.web.service.jaxws.model.Group;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Main service class for feeding data back to our front-end (javascript/angular UI),
 * or handling other actions triggered by the UI layer such has uploading files.
 * 
 * @author slenzi
 */
@Service
public class UIService {

    @InjectLogger
    private Logger logger;  
    
    @Autowired
    private StoreService storeService;
    
    @Autowired
    private GatekeeperService gatekeeperService;
    
    @Autowired
    private AuthWorldUserProvider authworldUserProvider;     
    
    /**
     * Check if there is an AuthWorldUser object in the session
     * 
     * @return
     */
    public Boolean haveAuthWorldUserInSession() {
    	
    	// TODO - possibly need spring profile for controlling whether or not update last active time in cookie when fetchin user
    	AuthWorldUser user = authworldUserProvider.getUserFromSession();
    	if(user != null) {
    		return true;
    	}
    	return false;
    	
    }
    
    /**
     * fetch group by group code
     * 
     * @param groupCode - the unique group code
     * @return
     * @throws ServiceException
     */
    public Group getGroup(String groupCode)  throws ServiceException {
    	
    	return gatekeeperService.getGroup(groupCode);
    	
    }
    
    /**
     * fetch all gatekeeper groups for a specific category
     * 
     * @param categoryCode
     * @return
     * @throws ServiceException
     */
    public List<Group> getGatekeeperGroupsForCategory(String categoryCode) throws ServiceException {
    	
    	return gatekeeperService.getGroupsForCategory(categoryCode);
    	
    }
    
    /**
     * fetch all gatekeeper categories
     * 
     * @return
     * @throws ServiceException
     */
    public List<Category> getGatekeeperCategories() throws ServiceException {
    	
    	return gatekeeperService.getGatekeeperCategories();
    }
    
    /**
     * fetch gatekeeper category for a group
     * 
     * @param groupCode - the unique group code
     * @return
     * @throws ServiceException
     */
    public Category getGatekeeperCategoryForGroup(String groupCode) throws ServiceException {
    	
    	return gatekeeperService.getCategoryForGroup(groupCode);
    	
    }
    
    /**
     * Calls E-A Store action service, addDirectory
     * 
     * @param dirNodeId - id of parent directory under which the new directory will be created
     * @param dirName - directory name
     * @param dirDesc - directory description
     * @param readGroup1 - optional read group
     * @param writeGroup1 - optional write group
     * @param executeGroup1 - optional execute group
     * @return
     * @throws ServiceException
     */
    public String addDirectory(Long dirNodeId, String dirName, String dirDesc, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {
    	
    	return storeService.addDirectory(dirNodeId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1);
    	
    }
    
    /**
     * Calls E-A Store action service, updateFile
     * 
     * @param fileNodeId - id of file to update
     * @param fileName - new name for the file
     * @param fileDesc - new description for the file
     * @return
     * @throws ServiceException
     */
    public String updateFile(Long fileNodeId, String fileName, String fileDesc) throws ServiceException {
    	
    	return storeService.updateFile(fileNodeId, fileName, fileDesc);
    	
    }
    
    /**
     * Calls E-A Store action service, updateDirectory
     * 
     * @param dirNodeId - id of directory to update
     * @param dirName - new name
     * @param dirDesc - new description
     * @param readGroup1 - optional read group
     * @param writeGroup1 - optional write group
     * @param executeGroup1 - optional execute group
     * @return
     * @throws ServiceException
     */
    public String updateDirectory(Long dirNodeId, String dirName, String dirDesc, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {
    	
    	return storeService.updateDirectory(dirNodeId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1);
    	
    }    
    
    /**
     * Forwards the incoming upload to ea-store
     * 
     * @param dirNodeId - ID of the directory path resource within the store, where the file is being added
     * @param fileName - file name of the incoming/uploaded file
     * @param dataHandler - interface to the binary data for the file
     * @throws ServiceException
     */
    @MethodTimer
    public String forwardUpload(Long storeId, Long dirNodeId, String fileName, DataHandler dataHandler) throws ServiceException {
    	
    	return storeService.uploadFile(dirNodeId, fileName, dataHandler);
    	
    }
    
    /**
     * Calls E-A Store JSON service, getStoreByName
     * 
     * @param storeName
     * @return
     * @throws ServiceException
     */
    public String getStoreByName(String storeName) throws ServiceException {
    	
    	return storeService.getStoreByName(storeName);
    	
    }    
    
    /**
     * Calls E-A Store JSON service, getStores
     *
     * @return
     * @throws ServiceException
     */
    public String getStores() throws ServiceException {
    	
    	return storeService.getStores();
    	
    }
    
	/**
	 * Call E-A Store getPathResourceById(...)
	 * 
	 * @param nodeId - the id of the path resource. If the ID is of a file meta resource the binary
	 * data for the file will not be inlcuded.
	 * @return
     * @throws ServiceException
     */
    public String getPathResourceById(Long nodeId) throws ServiceException {
    	
    	return storeService.getPathResourceById(nodeId);
    	
    }
    
    /**
     * Call E-A Store getPathResourceByPath(...)
     * 
     * @param storeName
     * @param relPath
     * @return
     */
	public String getPathResourceByPath(String storeName, String relPath) throws ServiceException {
		
		return storeService.getPathResourceByPath(storeName, relPath);
		
	}    
    
    /**
     * Calls E-A Store JSON service getBreadcrumbsByNodeId(...) method
     * 
     * @param nodeId - id of the path resource node
     * @return - JSON array of path resources, first element being the root, and last element being the child most element.
     * @throws ServiceException
     */
    public String getBreadcrumbsByNodeId(Long nodeId) throws ServiceException {
    	
    	return storeService.getBreadcrumbsByNodeId(nodeId);
    	
    }
    
    /**
     * Calls E-A Store JSON service getBreadcrumbsByPath(...) method
     * 
     * @param storeName - name of store
	 * @param relPath - the relative path of a resource within the source.
     * @return - JSON array of path resources, first element being the root, and last element being the child most element.
     * @throws ServiceException
     */
    public String getBreadcrumbsByPath(String storeName, String relPath) throws ServiceException {
    	
    	return storeService.getBreadcrumbsByPath(storeName, relPath);
    	
    }    
    
    /**
     * Calls E-A Store JSON service getChildPathResourceByPath(...) method
     * 
     * @param storeName - name of store
     * @param relPath - the relative path of a resource within the source.
     * @return JSON array, a listing of first-level child resource under resource with the provided 'relPath'
     * @throws ServiceException
     */
    public String getChildPathResourceByPath(String storeName, String relPath) throws ServiceException {
    	
    	return storeService.getChildPathResourceByPath(storeName, relPath);
    	
    }
    
    /**
     * Calls E-A Store action service, downloadFile(...) method
     * 
     * @param fileNodeId - node id of the file meta resource to download
     * @return
     * @throws ServiceException
     */
    public FileResponse getFile(Long fileNodeId) throws ServiceException {
    	
    	return storeService.getFileReponse(fileNodeId);
    	
    }
    
    /**
     * Pull list of protocol names, in lowercase, from all the directory path resources in the json response.
     * 
     * @param jsonResponse
     * @return
     * @throws JsonProcessingException
     * @throws IOException
     */
    private List<String> getProtNames(String jsonResponse) throws JsonProcessingException, IOException{
    	
    	ObjectMapper mapper = new ObjectMapper();
    	JsonNode root = mapper.readTree(jsonResponse);
    	
    	List<String> prots = new ArrayList<String>();
    	
    	if(root.isArray()){
    		for(JsonNode pathResource : root){
    			if(pathResource.path("resourceType").asText().toLowerCase().equals("directory")){
    				prots.add(pathResource.path("nodeName").asText().trim().toLowerCase());
    			}
    		}
    	}
    	
    	return prots;
    	
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
    	
    	return storeService.copyFile(fileNodeId, dirNodeId, replaceExisting);    	
    	
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
    	
    	return storeService.copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting);     	
    	
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
    	
    	return storeService.moveFile(fileNodeId, dirNodeId, replaceExisting);    	
    	
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
    	
    	return storeService.moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting);     	
    	
    }
    
    /**
     * Call E-A Store /fsys/action/removeFile
     * 
     * @param fileNodeId
     * @return
     * @throws ServiceException
     */
    public String removeFile(Long fileNodeId) throws ServiceException {
    	
    	return storeService.removeFile(fileNodeId);
    	
    }
    
    /**
     * Call E-A Store /fsys/action/removeDirectory
     * 
     * @param dirNodeId
     * @return
     * @throws ServiceException
     */
    public String removeDirectory(Long dirNodeId) throws ServiceException {
    	
    	return storeService.removeDirectory(dirNodeId);
    	
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
     */
	public String createStore(String storeName, String storeDesc, String storePath, String rootDirName, String rootDirDesc,
			Long maxFileSizeBytes, String readGroup1, String writeGroup1, String executeGroup1) throws ServiceException {
		
		return storeService.addStore(storeName, storeDesc, storePath, rootDirName, rootDirDesc,
				maxFileSizeBytes, readGroup1, writeGroup1, executeGroup1);
		
	}
	
    /**
     * Update a store
     * 
     * @param storeId - id of store to update
     * @param storeName - store name must be unique. an exception will be thrown if a store with
     * the provided name already exists.
     * @param storeDesc - store description
     * @param storePath - store path on the local file system. This application must have read/write
     * permission to create the directory.
     * @param maxFileSizeBytes - max file size in bytes allowed by the store for file storage in the
     * database in blob format (file will still be saved to the local file system.)
     * @param rootDirName - directory name for the root directory for the store.
     * @param rootDirDesc - description for the root directory
     * @param rootDirReadGroup1 - required read access group
     * @param rootDirWriteGroup1 - required write access group
     * @param rootDirExecuteGroup1 - required execute access group
     * @return
     */
	public String updateStore(Long storeId, String storeName, String storeDesc, String rootDirName, String rootDirDesc,
			String rootDirReadGroup1, String rootDirWriteGroup1, String rootDirExecuteGroup1) throws ServiceException {
		
		return storeService.updateStore(storeId, storeName, storeDesc, rootDirName, 
				rootDirDesc, rootDirReadGroup1, rootDirWriteGroup1, rootDirExecuteGroup1);
		
	}	

}
