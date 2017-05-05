package org.eamrf.eastoreui.web.jaxrs.eastore.client;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Create new instance of EAStoreClient
 * 
 * @author slenzi
 */
@Service
public class EAStoreClientProvider {

    @InjectLogger
    private Logger logger;
    
    @Value( "${eastore.jax.rs.service}" )    
    private String serviceUrl;
    
    @Value( "${eastore.jax.rs.service.user}" )    
    private String serviceUser;  
    
    @Value( "${eastore.jax.rs.service.pass}" )    
    private String servicePass;
    
    //private EAStoreClient client = null;
	
	public EAStoreClientProvider() {
		
	}
	
	public EAStoreClient getClient(){
		
		return new EAStoreClient(serviceUrl, serviceUser, servicePass);
		
	}

}
