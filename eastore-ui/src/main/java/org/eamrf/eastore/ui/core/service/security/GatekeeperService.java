/**
 * 
 */
package org.eamrf.eastore.ui.core.service.security;

import java.util.List;

import org.eamrf.core.exception.ServiceException;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.gatekeeper.web.service.jaxrs.client.GatekeeperRestClient;
import org.eamrf.gatekeeper.web.service.jaxws.model.Category;
import org.eamrf.gatekeeper.web.service.jaxws.model.Group;
import org.eamrf.web.rs.exception.WebServiceException;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for gatekeeper related actions
 * 
 * @author slenzi
 */
@Service
public class GatekeeperService {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private GateKeeperClientProvider clientProvider;
	
	/**
	 * 
	 */
	public GatekeeperService() {
		
	}
	
	/**
	 * Fetch group
	 * 
	 * @param groupCode - the unique group code
	 * @return
	 * @throws ServiceException
	 */
	public Group getGroup(String groupCode) throws ServiceException {
		
		GatekeeperRestClient client = clientProvider.getRestClient();
		
		Group group = null;
		try {
			group = client.getGroup(groupCode);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching group from gatekeeper for group code " + groupCode + ", " + e.getMessage(), e);
		}
		return group;
		
	}
	
	/**
	 * Fetch gatekeeper groups for a category
	 * 
	 * @param categoryCode - category code
	 * @return
	 * @throws ServiceException
	 */
	public List<Group> getGroupsForCategory(String categoryCode) throws ServiceException {
		
		GatekeeperRestClient client = clientProvider.getRestClient();
		
		List<Group> groups = null;
		try {
			groups = client.getGroupsForCategory(categoryCode);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching groups from gatekeeper for category " + categoryCode + ", " + e.getMessage(), e);
		}
		return groups;
		
	}
	
	/**
	 * Fetch gatekeeper categories
	 * 
	 * @return
	 * @throws ServiceException
	 */
	public List<Category> getGatekeeperCategories() throws ServiceException {
		
		GatekeeperRestClient client = clientProvider.getRestClient();
		
		List<Category> cats = null;
		try {
			cats = client.getCategories();
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching categories from gatekeeper, " + e.getMessage(), e);
		}
		
		return cats;
		
	}
	
	/**
	 * Fetch a category for a group
	 * 
	 * @param groupCode - the unique group code
	 * @return
	 * @throws ServiceException
	 */
	public Category getCategoryForGroup(String groupCode) throws ServiceException {
		
		GatekeeperRestClient client = clientProvider.getRestClient();
		
		Category cat = null;
		try {
			cat = client.getCategoryForGroupCode(groupCode);
		} catch (WebServiceException e) {
			throw new ServiceException("Error fetching category for group code " + groupCode + " from gatekeeper, " + e.getMessage(), e);
		}
		
		return cat;
		
	}

}
