package org.eamrf.eastoreui.core.model.file;

import java.io.IOException;
import java.io.InputStream;

/**
 * Model to store some data when we use prodoc jax-rs service (called from angularjs UI) to download
 * and file from e-a store jax-rs service.
 * 
 * @author slenzi
 */
public class FileResponse {

	private String name = null;
	private InputStream input = null;
	
	public FileResponse() {
		
	}

	public FileResponse(String name, InputStream input) {
		super();
		this.name = name;
		this.input = input;
	}

	public String getName() {
		return name;
	}

	public InputStream getInput() {
		return input;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setInput(InputStream input) {
		this.input = input;
	}
	
	public boolean hasInputStream(){
		return input != null ? true : false;
	}
	
	public void close(){
		try {
			input.close();
		} catch (IOException e) {
			// eat it
		}
	}

}
