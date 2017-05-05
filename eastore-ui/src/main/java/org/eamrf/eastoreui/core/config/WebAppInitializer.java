package org.eamrf.eastoreui.core.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.apache.cxf.transport.servlet.CXFServlet;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastoreui.core.constants.AppConstants;
import org.frontier.ecog.webapp.authworld.client.AuthWorldClientFilterImpl;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 * Bootstraps the application. This is an alternative to the usual /WEB-INF/web.xml file.
 * 
 * @author sal
 */
@Order(2) // run after SpringSecurityInitializer
public class WebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	private Properties appProps = null;
	
	public WebAppInitializer() {
		
		System.out.println(WebAppInitializer.class.getName() + " created");
	
		loadProps();
		
	}
	
	private void loadProps(){
		
		System.out.println(WebAppInitializer.class.getName() + ".loadProps() called");
		
		InputStream input = getClass().getClassLoader().getResourceAsStream(AppConstants.APP_PROPERTIES_FILE);
		
		appProps = new Properties();
		try {
			
			appProps.load(input);
			
		} catch (IOException e) {
			e.printStackTrace();
		}		
		
	}	

	/**
	 * Configure root application context
	 */
	@Override
	protected Class<?>[] getRootConfigClasses() {

		System.out.println(WebAppInitializer.class.getName() + ".getRootConfigClasses() called");
		
		Class<?>[] rootConfigClasses = new Class<?>[] { 
				AppConfig.class
				};

		return rootConfigClasses;		
		
	}

	/**
	 * Configure servlet (MVC) context.
	 */
	@Override
	protected Class<?>[] getServletConfigClasses() {

		System.out.println(WebAppInitializer.class.getName() + ".getServletConfigClasses() called");
		
		Class<?>[] servletConfigClasses = new Class<?>[] { WebMvcConfig.class };

		return servletConfigClasses;		
		
	}
	
	@Override
	protected String getServletName() {
		
		System.out.println(WebAppInitializer.class.getName() + ".getServletName() called");
		
		return "dispatcher";
		
	}

	@Override
	protected String[] getServletMappings() {
		
		System.out.println(WebAppInitializer.class.getName() + ".getServletMappings() called");
		
		String[] servletMappings = new String[] { "/spring/*" };

		return servletMappings;
		
	}

	@Override
	protected void registerContextLoaderListener(ServletContext servletContext) {
		
		System.out.println(WebAppInitializer.class.getName() + ".registerContextLoaderListener(ServletContext) called");
		
		super.registerContextLoaderListener(servletContext);
		
		//
		// Registered a Request Context Listener so we can access HttpServletRequest in our non-controller
		// spring beans. e.g., accessing the current logged in AuthWorld user in our jax-rs services.
		//
		servletContext.addListener(new RequestContextListener());
		
	}

	/**
	 * Register Apache CXF servlet on startup.
	 */
	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {
		
		System.out.println(WebAppInitializer.class.getName() + ".onStartup(ServletContext) called");
		
		super.onStartup(servletContext);
		
		registerAuthWorldClientFilter(servletContext);
		
		registerApacheCxfServlet(servletContext);
		
	}
	
	/**
	 * Setup AuthWorld Client Filter
	 * 
	 * @param servletContext
	 */
	private void registerAuthWorldClientFilter(ServletContext servletContext) {
		
		FilterRegistration.Dynamic authWorldFilter = servletContext.addFilter("authworldFilter", new AuthWorldClientFilterImpl());
		
		// Map AuthWorld Client Filter:
		// To: /spring (controllers)
		// To: /cxf (all web services)
		// To: /private (URLs)
		// To: /secure (web content folder)
		authWorldFilter.addMappingForUrlPatterns(null, true, "/spring/*", "/cxf/*", "/private/*", "/secure/*");
		
		String authFilterActive = StringUtil.changeNull(appProps.getProperty("authworld.filter.active"));
		String authFilterLogoutCheck = StringUtil.changeNull(appProps.getProperty("authworld.filter.doLogoutCheck"));
		String authFilterLogUrlRequests = StringUtil.changeNull(appProps.getProperty("authworld.filter.doLogUrlRequests"));
		String authFilterAuthworldUrl = StringUtil.changeNull(appProps.getProperty("authworld.url"));
		
		System.out.println("AuthWorld Client Filter: Active => " + authFilterActive);
		System.out.println("AuthWorld Client Filter: Logout Check => " + authFilterLogoutCheck);
		System.out.println("AuthWorld Client Filter: Log URL Requests => " + authFilterLogUrlRequests);
		System.out.println("AuthWorld Client Filter: AuthWorld URL => " + authFilterAuthworldUrl);
		
		authWorldFilter.setInitParameter("isActive", authFilterActive);
		authWorldFilter.setInitParameter("doLogoutCheck", authFilterLogoutCheck);
		authWorldFilter.setInitParameter("doLogUrlRequests", authFilterLogoutCheck);
		authWorldFilter.setInitParameter("authworldUrl", authFilterAuthworldUrl);
		
	}
	
	/**
	 * Setup CXF Servlet
	 * 
	 * @param servletContext
	 */
	private void registerApacheCxfServlet(ServletContext servletContext){
		
		System.out.println(WebAppInitializer.class.getName() + ".registerApacheCxfServlet(ServletContext) called");
		
		ServletRegistration.Dynamic jaxWsServlet = servletContext.addServlet("cxf", new CXFServlet());
		
		jaxWsServlet.addMapping("/cxf/*");		
		
	}
	
	/**
	 * Make sure to set active spring profiles.
	 */
	@Override
	protected WebApplicationContext createRootApplicationContext() {
	
		WebApplicationContext context = super.createRootApplicationContext();
		
		((ConfigurableEnvironment) context.getEnvironment()).setActiveProfiles( loadSpringProfilesFromProperties() );
		
		return context;
		
	}

	/**
	 * Read spring profile names from application properties file
	 * 
	 * @return
	 */
	private String[] loadSpringProfilesFromProperties() {
		
		System.out.println(WebAppInitializer.class.getName() + ".loadSpringProfilesFromPropertie() called");
		
		InputStream input = getClass().getClassLoader().getResourceAsStream(AppConstants.APP_PROPERTIES_FILE);
		
		Properties properties = new Properties();
		try {
			
			properties.load(input);
			String[] props = properties.getProperty("spring.profiles.active").split(",");
			if(props != null && props.length > 0){
				for(int propIndex = 0; propIndex < props.length; propIndex++){
					props[propIndex] = StringUtil.changeNull(props[propIndex]).trim();
					System.out.println("Active Spring Profile => '" + props[propIndex] + "'");
				}
			}
			return props;
			
		} catch (IOException e) {
			e.printStackTrace();
			String[] defaultProfiles = { "fubar" };
			return defaultProfiles;
		}

	}	


}
