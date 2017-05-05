package org.eamrf.eastoreui.core.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Configure JdbcTemplate to use our oracle datasource
 * 
 * @author slenzi
 */
@Configuration
public class JdbcConfig {

	@Autowired
	@Qualifier("ecoguserOracleDataSource")
	DataSource dataSource;	
	
	@Bean
	public JdbcTemplate getJdbcTemplate() {
		return new JdbcTemplate(dataSource);
	}

}
