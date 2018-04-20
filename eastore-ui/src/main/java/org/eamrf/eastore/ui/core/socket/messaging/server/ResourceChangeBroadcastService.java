/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.server;

import javax.annotation.PostConstruct;

import org.eamrf.core.logging.stereotype.InjectLogger;
import org.eamrf.eastore.ui.core.socket.messaging.model.ResourceChangeMessage;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Message service for notifying clients that resources have changed on the server.
 * 
 * Messages are broadcasted to /topic/resource/change
 * 
 * @author slenzi
 */
@Service
public class ResourceChangeBroadcastService {

	@InjectLogger
	private Logger logger;	
	
    @Autowired
    private SimpMessagingTemplate template; 
    
    private final String messageDestination = "/topic/resource/change";    
	
	public ResourceChangeBroadcastService() { }
    
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
	 * Broadcast a resource change message
	 * 
	 * @param message
	 */
	public void broadcast(ResourceChangeMessage message) {
		
		logger.info("Broadcasting resource change event, " + message.toString());
		
		template.convertAndSend(messageDestination, message);		
		
	}

}
