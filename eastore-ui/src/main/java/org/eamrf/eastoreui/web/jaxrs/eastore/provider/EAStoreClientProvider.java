package org.eamrf.eastoreui.web.jaxrs.eastore.provider;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.client.jaxrs.EAStoreActionClient;
import org.eamrf.eastore.client.jaxrs.EAStoreJsonClient;
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
    
	public EAStoreClientProvider() {
		
	}
	
	public EAStoreJsonClient getJsonClient(){
		
		return new EAStoreJsonClient(serviceUrl, serviceUser, servicePass);
		
	}
	
	public EAStoreActionClient getActionClient(){
		
		return new EAStoreActionClient(serviceUrl, serviceUser, servicePass);
		
	}	

}