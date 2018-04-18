package org.eamrf.eastore.ui.core.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Controller;

/**
 * Spring project configuration setup..
 * 
 * @see org.eamrf.eastore.ui.core.config.WebAppInitializer for bootstrap process.
 * 
 * @author sal
 */
@Configuration
@ComponentScan(
	basePackages = {
		"org.eamrf.core.logging",
		"org.eamrf.core.jpa",
		"org.eamrf.web",
		"org.eamrf.eastore.ui.web",
		"org.eamrf.eastore.ui.core"
		//,"org.eamrf.repository"
	},
	excludeFilters = {
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Controller.class),
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Configuration.class)
	}
)
@Import({
	PropertyConfig.class
	,CxfConfig.class
	, WebSocketConfig.class
	
	// project doesn't currently use any databases
	//,DataSourceConfig.class
	//,JdbcConfig.class
	
})
@EnableAspectJAutoProxy
public class AppConfig {
	
}
