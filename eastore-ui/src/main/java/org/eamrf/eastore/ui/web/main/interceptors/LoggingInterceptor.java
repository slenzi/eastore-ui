/**
 * 
 */
package org.eamrf.eastore.ui.web.main.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author sal
 *
 * Sample intercepter, configured in WebMvcConfig.
 *
 * @see org.lenzi.fstore.main.config.WebMvcConfig
 */
@Component
public class LoggingInterceptor implements HandlerInterceptor {

	@InjectLogger
	private Logger logger;	
	
	/**
	 * 
	 */
	public LoggingInterceptor() {
	
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#afterCompletion(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, java.lang.Exception)
	 */
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
		
		logger.info(LoggingInterceptor.class.getName() + ".afterCompletion(...) called");
		logger.info("Request URI = " + request.getRequestURI());
		logger.info("Request URL = " + request.getRequestURL().toString());

	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#postHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		
		logger.info(LoggingInterceptor.class.getName() + ".postHandle(...) called");
		logger.info("Request URI = " + request.getRequestURI());
		logger.info("Request URL = " + request.getRequestURL().toString());		

	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.HandlerInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object)
	 */
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object modelAndView) throws Exception {

		logger.info(LoggingInterceptor.class.getName() + ".postHandle(...) called");
		logger.info("Request URI = " + request.getRequestURI());
		logger.info("Request URL = " + request.getRequestURL().toString());		
		
		return true;
		
	}

}
