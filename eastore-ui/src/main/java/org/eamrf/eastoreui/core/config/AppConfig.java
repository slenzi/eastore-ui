package org.eamrf.eastoreui.core.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Controller;

/**
 * Spring project configuration setup..
 * 
 * @see org.eamrf.eastoreui.core.config.WebAppInitializer for bootstrap process.
 * 
 * @author sal
 */
@Configuration
@ComponentScan(
	basePackages = {
		"org.eamrf.core.logging",
		"org.eamrf.core.jpa",
		"org.eamrf.web",
		"org.eamrf.eastoreui.web",
		"org.eamrf.eastoreui.core",
		"org.eamrf.repository"
	},
	excludeFilters = {
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Controller.class),
		@ComponentScan.Filter(type = FilterType.ANNOTATION, value = Configuration.class)
	}
)
@Import({
	PropertyConfig.class,
	DataSourceConfig.class,
	JdbcConfig.class,
	CxfConfig.class
})
public class AppConfig {
	
}
