package org.eamrf.eastoreui.core.config;

import javax.sql.DataSource;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.properties.ManagedProperties;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariDataSource;

/**
 * Configure JDBC datasource using Hikari CP pooling
 * 
 * @author slenzi.
 */
@Configuration
public class DataSourceConfig {

	@InjectLogger
	private Logger logger;		
	
    @Autowired
    private ManagedProperties appProps;   
    
	public DataSourceConfig() {
		
	}
	
	/**
	 * Get ecoguser data source
	 * 
	 * @return
	 */
	@Bean(name="ecoguserOracleDataSource")
	@Primary
	public DataSource getEcoguserOracleDataSource(){
		
		logger.info(this.getClass().getName() + ".getEcoguserOracleDataSource() called.");
		
		DataSource dataSource = getOracleEcoguserDatasource();
		
		return dataSource;
		
	}
	
	/**
	 * Create data source for oracle ecoguser
	 * 
	 * @return
	 */
	private DataSource getOracleEcoguserDatasource(){
		
		String dbUrl = appProps.getProperty("jdbc.oracle.ecoguser.url");
		String dbDriver = appProps.getProperty("jdbc.oracle.ecoguser.driver");
		String dbUser = appProps.getProperty("jdbc.oracle.ecoguser.user");
		String dbPassword = appProps.getProperty("jdbc.oracle.ecoguser.password");
		String hikariMaxPoolSize = appProps.getProperty("hikari.maximum-pool-size");
		
		Integer maxPoolSize = Integer.valueOf(hikariMaxPoolSize);
		
		return getHikariDataSource(dbUrl, dbDriver, dbUser, dbPassword, maxPoolSize.intValue());
		
	}	
	
	/**
	 * Create a Hikari pool managed datasource
	 * 
	 * @param dbUrl
	 * @param dbDriver
	 * @param dbUser
	 * @param dbPassword
	 * @param maxPoolSize
	 * @return
	 */
	private HikariDataSource getHikariDataSource(String dbUrl, String dbDriver, String dbUser, String dbPassword, int maxPoolSize) {
		
	   final HikariDataSource ds = new HikariDataSource();
	   
	   ds.setMaximumPoolSize(maxPoolSize);
	   ds.setDriverClassName(dbDriver); 
	   ds.setJdbcUrl(dbUrl); ;
	   ds.setUsername(dbUser);
	   ds.setPassword(dbPassword);
	   
	   return ds;		
		
	}
	
}
