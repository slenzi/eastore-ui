/**
 * 
 */
package org.eamrf.eastoreui.core.service.security;

import java.util.List;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.exception.ServiceException;
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

}
