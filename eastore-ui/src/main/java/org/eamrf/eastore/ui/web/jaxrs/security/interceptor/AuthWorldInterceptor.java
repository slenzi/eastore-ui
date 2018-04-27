/**
 * 
 */
package org.eamrf.eastore.ui.web.jaxrs.security.interceptor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.NameBinding;

import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.transport.http.AbstractHTTPDestination;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.DateUtil;
import org.eamrf.eastore.ui.core.service.AuthenticationService;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Interceptor which will eventually handle authworld security integration.
 * 
 * Currently updates the authworld cookie when *some* of our jax-rs services are called
 * 
 * @author slenzi
 */
@Component
public class AuthWorldInterceptor extends AbstractPhaseInterceptor<Message> {

	@InjectLogger
	private Logger logger;
	
	@Autowired
	private AuthenticationService authenticationService;
	
	private final Pattern pattern = Pattern.compile(".*easapi\\/v\\d*\\/ui\\/(action|json).*");
	
	public AuthWorldInterceptor() {
		super(Phase.POST_INVOKE);
	}

	@Override
	public void handleMessage(Message message) throws Fault {
		
		HttpServletRequest request = (HttpServletRequest) message.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) message.get(AbstractHTTPDestination.HTTP_RESPONSE);
		
		//message.get(Message.REQUEST_URL);
		String requestUrl = request.getRequestURL().toString();
		//logger.info("Request URL => " + requestUrl);
		
		// fire when the request is for the UI 'action' or 'json' jax-rs services		
		Matcher matcher = pattern.matcher(requestUrl);
		if(matcher.find()) {
			
			logger.info("Matched URL! Check for authworld cookie and update it...");
		
			//String enpointAddress = (String)message.get(Message.ENDPOINT_ADDRESS);
			//logger.info("Endpoint Address => " + enpointAddress);
			
			if(authenticationService.isAuthenticationActive()) {
				
				authenticationService.updateAuthWorldCookieLastActive(request, response);
				
			}			
			
		}
		
	}
	
}
