package org.eamrf.eastore.ui.web.main.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.core.util.StringUtil;
import org.eamrf.eastore.ui.core.properties.ManagedProperties;
import org.frontier.ecog.webapp.authworld.client.AuthWorldClient;
import org.frontier.ecog.webapp.authworld.model.AuthWorldUser;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Home controller. Make sure MVC is working....
 * 
 * @author sal
 */
@Controller
@RequestMapping("/private/main/home")
public class HomeController extends AbstractSpringController {

    @InjectLogger
    private Logger logger;
    
    @Autowired
    private ManagedProperties appProps;
	
	public HomeController() {
		
	}
	
	/**
	 * Entry point
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(method = { RequestMethod.GET, RequestMethod.POST })
	public String home(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		
		logger.info(HomeController.class.getName() + ".home(....) called.");
		
		String userName = "Unknown / Not logged in";
		
		AuthWorldUser authUser = AuthWorldClient.getAuthWorldUser(request);
		if(authUser != null){
		userName = StringUtil.changeNull(authUser.getFirstName()) + " " + 
				StringUtil.changeNull(authUser.getLastName());
		}
		
		String appTitle = appProps.getProperty("application.title");
		
		logger.info("Application Title => " + appTitle);
		logger.info("AuthWorld User => " + userName);
		
		return "/secure/home/index.jsp";
		
	}	

}
