/**
 * 
 */
package org.eamrf.eastoreui.web.jaxrs.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.transport.http.AbstractHTTPDestination;
import org.eamrf.core.logging.stereotype.InjectLogger;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

/**
 * Interceptor which will eventually handle authworld security integration
 * 
 * @author slenzi
 */
@Component
public class AuthWorldInterceptor extends AbstractPhaseInterceptor<Message> {

	@InjectLogger
	private Logger logger;		
	
	public AuthWorldInterceptor() {
		super(Phase.INVOKE);
	}

	@Override
	public void handleMessage(Message message) throws Fault {
		
		logger.info(AuthWorldInterceptor.class.getName() + ".handleMessage(...)");
		
		HttpServletRequest request = (HttpServletRequest) message.get(AbstractHTTPDestination.HTTP_REQUEST);
		
		String requestUrl = request.getRequestURL().toString();
		
		logger.info(requestUrl);
		
	}
	
}
