/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.server;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * @author slenzi
 */
public abstract class AbstractBroadcastService {

    @Autowired
    private SimpMessagingTemplate template; 	
	
	/**
	 * 
	 */
	public AbstractBroadcastService() {
		
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
	
	protected void convertAndSend(String destination, Object payload) {
		
		template.convertAndSend(destination, payload);
		
	}
	
	protected void convertAndSendToUser(String destination, Object payload, String user) {
		
		template.convertAndSendToUser(user, destination, payload);
		
	}	

}
