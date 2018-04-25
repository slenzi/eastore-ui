/**
 * 
 */
package org.eamrf.eastore.ui.core.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;

/**
 * Bootstraps the web application
 * 
 * @author slenzi
 */
@SpringBootApplication
@Import({
	AppConfig.class
})
public class SpringBootWebApplication extends SpringBootServletInitializer {

	/**
	 * 
	 */
	public SpringBootWebApplication() {
		
	}

	/* (non-Javadoc)
	 * @see org.springframework.boot.web.support.SpringBootServletInitializer#configure(org.springframework.boot.builder.SpringApplicationBuilder)
	 */
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(SpringBootWebApplication.class);
	}
	
	public static void main(String[] args) throws Exception {
		
		System.out.println("Starting eastore ui spring boot application");
		
        SpringApplication.run(SpringBootWebApplication.class, args);
        
    }
	
}
