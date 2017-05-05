package org.eamrf.eastoreui.core.config;

import java.util.Arrays;

import javax.ws.rs.ext.RuntimeDelegate;

import org.apache.cxf.bus.spring.SpringBus;
import org.apache.cxf.endpoint.Server;
import org.apache.cxf.jaxrs.JAXRSServerFactoryBean;
import org.eamrf.eastoreui.web.jaxrs.local.StoreUIApplication;
import org.eamrf.eastoreui.web.jaxrs.local.TestResource;
import org.eamrf.eastoreui.web.jaxrs.local.UIResource;
import org.eamrf.web.rs.exception.WebServiceExceptionMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;

/**
 * Configure our Apache CXF services.
 * 
 * @author slenzi
 */
@Configuration
public class CxfConfig {

	public CxfConfig() { }
	
	/**
	 * will call shutdown on SpringBus when bean is destroyed.
	 * 
	 * @return
	 */
	@Bean( destroyMethod = "shutdown" )
	public SpringBus cxf() {
		return new SpringBus();
	}
	
	/**
	 * Configure StoreUI JAX-RS Services
	 * 
	 * @author slenzi
	 */
	@Configuration
	static class StoreUIJaxRsServiceConfig {
		
		/**
		 * Setup StoreUI JAX-RS endpoint
		 * 
		 * @return
		 */
		@Bean(name="storeUIJaxRsServer")
		@DependsOn ( "cxf" )	
		public Server getStoreUIJaxRsServer() {
			
			RuntimeDelegate delegate = RuntimeDelegate.getInstance();
			
			JAXRSServerFactoryBean factory = delegate.createEndpoint( 
					getStoreUIApplication(), JAXRSServerFactoryBean.class );
			
			// Add service beans
			factory.setServiceBeans(
				Arrays.<Object>asList(
					getTestResource(), getUIResource()
				)
			);
			
			// Add providers
			factory.setProviders( Arrays.<Object>asList( 
				getJsonProvider(),
				//getEAAuthRequestHandler(), // Remove security until we have a better solution that works with our Angular front-end
				getExceptionMapper()
				) );			
			
			return factory.create();
			
		}
		
		/**
		 * Create instance of our 'easapi/v1' jax-rs application.
		 * 
		 * @return
		 */
		@Bean
		public StoreUIApplication getStoreUIApplication(){
			return new StoreUIApplication();
		}
		
		/**
		 * Get instance of TestResource
		 * 
		 * @return
		 */
		@Bean
		public TestResource getTestResource(){
			return new TestResource();
		}
		
		@Bean
		public UIResource getUIResource(){
			return new UIResource();
		}
		
		/**
		 * jax-rs JSON marshalling / provider
		 * 
		 * @return
		 */
		@Bean
	    public JacksonJsonProvider getJsonProvider() {
	        return new JacksonJsonProvider();
	    }
		
		/**
		 * Maps our WebServiceException to http response codes.
		 * 
		 * @return
		 */
		@Bean
		public WebServiceExceptionMapper getExceptionMapper(){
			return new WebServiceExceptionMapper();
		}		
		
	};	

}
