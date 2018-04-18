/**
 * 
 */
package org.eamrf.eastore.ui.core.service;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.client.jaxrs.v1.EAStoreSearchClient;
import org.eamrf.eastore.ui.core.exception.ServiceException;
import org.eamrf.eastore.ui.web.jaxrs.eastore.provider.EAStoreClientProvider;
import org.eamrf.web.rs.exception.WebServiceException;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class for executing searches (lucene)
 * 
 * @author slenzi
 */
@Service
public class SearchService {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private EAStoreClientProvider eaStoreClientProvider;
    
    @Autowired
    private AuthenticationService authService;     
	
	/**
	 * 
	 */
	public SearchService() {
		
	}
	
	/**
	 * Run a basic file content search within the store.
	 * 
	 * @param storeId - ID of store to search in
	 * @param searchTerm - the search term/value
	 * @return
	 * @throws ServiceException
	 */
	public String runBasicContentSearch(Long storeId, String searchTerm) throws ServiceException {
		
		EAStoreSearchClient client = eaStoreClientProvider.getSearchClient();
		
		String userId = authService.getUserId();
		
		try {
			return client.basicContentSearch(storeId, searchTerm, userId);
		} catch (WebServiceException e) {
			throw new ServiceException("Error performing search for term '" + searchTerm + "' in store with storeId " + storeId + ", " + e.getMessage(), e);
		}
		
	}

}
