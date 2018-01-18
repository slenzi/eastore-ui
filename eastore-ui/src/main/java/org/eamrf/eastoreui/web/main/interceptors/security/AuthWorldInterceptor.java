package org.eamrf.eastoreui.web.main.interceptors.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastoreui.core.service.AuthenticationService;
import org.eamrf.eastoreui.web.main.interceptors.LoggingInterceptor;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * Interceptor for updating the last active time in the authworld credentials cookie.
 * 
 * This Interceptor will intercept all requests for the following jax-rs resources, and update the cookie
 * 
 * org.eamrf.eastoreui.web.jaxrs.local.UIActionResource
 * org.eamrf.eastoreui.web.jaxrs.local.UIJsonResource
 * 
 * @author slenzi
 * 
 * @deprecated - doesn't seem to fire for jaxrs requests....not sure why.
 *
 */
//@Component
public class AuthWorldInterceptor implements HandlerInterceptor {

	@InjectLogger
	private Logger logger;
	
	@Autowired
	private AuthenticationService authenticationService;
	
	public AuthWorldInterceptor() {

	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception modelView) throws Exception {

		logger.info(LoggingInterceptor.class.getName() + ".afterCompletion(...) called");
		
		Cookie cookie = getAuthWorldCookie(request);
		if(cookie != null) {
			logger.info("Found AuthWorld credentials cookie -> " + cookie.toString());
		}else {
			logger.info("AuthWorld credentials cookie could not be found... boo...");
		}
		
		
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelView) throws Exception {

		logger.info(LoggingInterceptor.class.getName() + ".postHandle(...) called");
		
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		
		logger.info(LoggingInterceptor.class.getName() + ".preHandle(...) called");
		
		return false;
	}
	
	/**
	 * Fetch the authworld credentials cookie from the request
	 * 
	 * @param request
	 * @return
	 */
	private Cookie getAuthWorldCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if(cookies != null && cookies.length > 0) {
			final String authWorldCookieName = authenticationService.getAuthWorldCookieName();
			for(int i=0; i<cookies.length; i++) {
				if(cookies[i].getName().equals(authWorldCookieName)) {
					return cookies[i];
				}
			}
		}
		return null;
	}

}
