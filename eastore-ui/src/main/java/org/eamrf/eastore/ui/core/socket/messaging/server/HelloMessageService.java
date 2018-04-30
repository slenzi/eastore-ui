package org.eamrf.eastore.ui.core.socket.messaging.server;

import javax.annotation.PostConstruct;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Sends a hello message to a specific client
 * 
 * @author slenzi
 *
 */
@Service
public class HelloMessageService {

	@InjectLogger
	private Logger logger;	
	
    @Autowired
    private SimpMessagingTemplate template;
    
    private final String messageDestination = "/topic/hello";
	
	public HelloMessageService() {
	
	}
	
	@PostConstruct
	public void init(){
		
		// custom converter which supports java8 LocalDate and LocalTime formats
		MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
		converter.setObjectMapper(objectMapper());
		template.setMessageConverter(converter);
		
	}
	
	private ObjectMapper objectMapper() {

		ObjectMapper objectMapper = new ObjectMapper()
				.registerModule(new Jdk8Module())
				.registerModule(new JavaTimeModule());
		
		//objectMapper.findAndRegisterModules();

		return objectMapper;

	}
	
	/**
	 * Send a message to a specific websocket client
	 * 
	 * @param principalUserId
	 * @param message
	 */
	public void sendHello(String principalUserId, String message) {
		
		logger.info("Sending hello message to principal user id " + principalUserId + ", " + message.toString());		
		
		template.convertAndSendToUser(principalUserId, messageDestination, message);
		
	}

}
