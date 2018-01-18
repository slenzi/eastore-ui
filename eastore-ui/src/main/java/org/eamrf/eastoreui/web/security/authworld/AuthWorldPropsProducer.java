package org.eamrf.eastoreui.web.security.authworld;

import java.util.Arrays;

import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.properties.ManagedProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Produces an instance of AuthWorldProps.
 * 
 * @author slenzi
 *
 */
@Service
public class AuthWorldPropsProducer {
	
	@Autowired
	private ManagedProperties appProps;	

	public AuthWorldPropsProducer() {

	}
	
	@Bean
	public AuthWorldProps getProps() {
		
		AuthWorldProps props = new AuthWorldProps();
		
		String propAuthWorldActive = StringUtil.changeNull(appProps.getProperty("authworld.active"));
		String propAuthWorldUrl = StringUtil.changeNull(appProps.getProperty("authworld.url"));
		String propAuthWorldCookieMaxAge = StringUtil.changeNull(appProps.getProperty("authworld.cookie.max.age.seconds"));
		String propAuthWorldCookieComments = StringUtil.changeNull(appProps.getProperty("authworld.cookie.comments"));
		String propAuthWorldCookiePath = StringUtil.changeNull(appProps.getProperty("authworld.cookie.path"));
		
		props.setActive(Arrays.asList("true","yes","y","1").contains(propAuthWorldActive.toLowerCase()));
		props.setAuthworldUrl(propAuthWorldUrl);
		props.setCookieMaxAgeSeconds(Integer.valueOf(propAuthWorldCookieMaxAge));
		props.setCookieComments(propAuthWorldCookieComments);
		props.setCookiePath(propAuthWorldCookiePath);
		
		return props;
		
	}	

}
