package org.eamrf.eastore.ui.web.security.authworld;


public class AuthWorldProps {

	private String cookiePath = null;
	private String cookieComments = null;
	private Integer cookieMaxAgeSeconds = Integer.MAX_VALUE;
	private String authworldUrl = null;
	private boolean isActive = false;
	
	public AuthWorldProps() {
		
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getCookiePath() {
		return cookiePath;
	}

	public void setCookiePath(String cookiePath) {
		this.cookiePath = cookiePath;
	}

	public String getCookieComments() {
		return cookieComments;
	}

	public void setCookieComments(String cookieComments) {
		this.cookieComments = cookieComments;
	}

	public Integer getCookieMaxAgeSeconds() {
		return cookieMaxAgeSeconds;
	}

	public void setCookieMaxAgeSeconds(Integer cookieMaxAgeSeconds) {
		this.cookieMaxAgeSeconds = cookieMaxAgeSeconds;
	}

	public String getAuthworldUrl() {
		return authworldUrl;
	}

	public void setAuthworldUrl(String authworldUrl) {
		this.authworldUrl = authworldUrl;
	}
	


}
