package org.eamrf.eastoreui.web.security.authworld;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Produces an instance of AuthWorldProps. The props will be different depending on whether or
 * not the 'authworld' spring profile is active or inactive.
 * 
 * @author slenzi
 *
 */
@Service
public class AuthWorldPropsProducer {

	public AuthWorldPropsProducer() {

	}
	
	/**
	 * Get authworld props for when the 'authworld' spring profile is active
	 */
	@Bean
	@Profile("authworld")
	public AuthWorldProps getActiveProps() {
		
		AuthWorldProps props = new AuthWorldProps();
		props.setActive(true);
		return props;
		
	}
	
	/**
	 * Get authworld props for when the 'authworld' spring profile is NOT active
	 */
	@Bean
	@Profile("!authworld")
	public AuthWorldProps getInActiveProps() {
		
		AuthWorldProps props = new AuthWorldProps();
		props.setActive(false);
		return props;
		
	}	

}
