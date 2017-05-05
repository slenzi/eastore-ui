package org.eamrf.eastoreui.core.config;

import java.util.List;

import org.eamrf.eastoreui.web.main.interceptors.LoggingInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Spring MVC configuration.
 * 
 * @see org.eamrf.eastoreui.core.config.WebAppInitializer for bootstrap process.
 * 
 * Component scanning notes:
 * -- org.eamrf.core.logging : custom LoggerBeanPostProccessor which enables us to inject a logger using @InjectLogger annotation.
 * -- org.eamrf.prodoc.web.main.controller : main controllers package
 * 
 * @author slenzi
 */
@Configuration
@EnableWebMvc
@ComponentScan(
	basePackages = {
		"org.eamrf.core.logging",
		"org.eamrf.prodoc.web.main.controller"
		}
)
public class WebMvcConfig extends WebMvcConfigurerAdapter {

	@Autowired
	private LoggingInterceptor loggingInterceptor;
	
	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#configureDefaultServletHandling(org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer)
	 */
	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/public/**").addResourceLocations("classpath:/public/");
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#configureMessageConverters(java.util.List)
	 */
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

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addInterceptors(org.springframework.web.servlet.config.annotation.InterceptorRegistry)
	 */
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		//super.addInterceptors(registry);
		
		// sample interceptor which simply logs before and after interception of request
		registry.addInterceptor(loggingInterceptor);
		
		// example path mapping...
		//registry.addInterceptor(new LoggingInterceptor()).addPathPatterns("/fstore/administration/*");
	
	}
	
}