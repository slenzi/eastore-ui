package org.eamrf.eastore.ui.core.config;

import java.util.List;

import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.eamrf.eastore.ui.web.main.interceptors.LoggingInterceptor;
import org.eamrf.eastore.ui.web.main.security.interceptors.AuthWorldInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

/**
 * Spring MVC configuration.
 * 
 * @see org.eamrf.eastore.ui.core.config.WebAppInitializer for bootstrap process.
 * 
 * Component scanning notes:
 * -- org.eamrf.core.logging : custom LoggerBeanPostProccessor which enables us to inject a logger using @InjectLogger annotation.
 * -- org.eamrf.eastore.ui.web.main.controller : main controllers package
 * 
 * @author slenzi
 */
/*
@Configuration
@EnableWebMvc
@ComponentScan(
	basePackages = {
		"org.eamrf.core.logging",
		"org.eamrf.eastore.ui.web.main.controller"
		}
)
*/

//@ServletComponentScan - support the @WebServlet, @WebFilter, and @WebListener http://www.baeldung.com/spring-servletcomponentscan

//@ComponentScan
//@EnableWebMvc - Spring boot will automatically configure MVC features. Only use @EnableWebMvc if you want to take complete control of Spring MVC
@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

	@Autowired
	private ManagedProperties appProps;
	
	@Autowired
	private LoggingInterceptor loggingInterceptor;
	
	//@Autowired
	//private AuthWorldInterceptor authWorldInterceptor;
	
	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#configureDefaultServletHandling(org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer)
	 */
	/*
	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}
	*

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
	 */
	/*
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/public/**").addResourceLocations("classpath:/public/");
	}
	*/

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#configureMessageConverters(java.util.List)
	 */
	/*
	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		
		//
		// for pushing (uploading) files from a spring controller back to the clients browser.
		//
		converters.add(new ResourceHttpMessageConverter());
		converters.add(new ByteArrayHttpMessageConverter());
		
		converters.add(new StringHttpMessageConverter());
		
		super.configureMessageConverters(converters);
		
	}
	*/

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry)
	 */
	/*
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		System.out.println("Registering interceptors.");
		
		final String appContext = appProps.getProperty("application.context");
		
		//super.addInterceptors(registry);
		
		// sample interceptor which simply logs before and after interception of all request
		registry.addInterceptor(loggingInterceptor).addPathPatterns("/**");
		
		// intercept all requests for jax-rs ui action & json services
		//registry.addInterceptor(authWorldInterceptor).addPathPatterns(
		//		"/cxf/easapi/v1/ui/action/**",
		//		"/cxf/easapi/v1/ui/json/**"
		//		);
		
		// example path mapping...
		//registry.addInterceptor(new LoggingInterceptor()).addPathPatterns("/fstore/administration/*");
	
	}
	*/
	

	/*
	@Bean
    public InternalResourceViewResolver viewResolver() {
		
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/");
        //resolver.setSuffix(".jsp");
        
        return resolver;
        
    }
    */

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#configureViewResolvers(org.springframework.web.servlet.config.annotation.ViewResolverRegistry)
	 */
	@Override
	public void configureViewResolvers(ViewResolverRegistry registry) {
		
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("/"); // /WEB-INF/views/
		//resolver.setSuffix(".jsp");
		//resolver.setViewClass(JstlView.class);
		registry.viewResolver(resolver);
		
	}	
	
}