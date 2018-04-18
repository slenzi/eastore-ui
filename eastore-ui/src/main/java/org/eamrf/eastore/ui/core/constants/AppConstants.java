/**
 * 
 */
package org.eamrf.eastore.ui.core.constants;

/**
 * @author sal
 *
 */
public abstract class AppConstants {

	public static final String APP_PROPERTIES_FILE = "application.properties";
	
	public static final String PROP_NAME_MAIL_SERVER = "email.server";
	public static final String PROP_NAME_MAIL_TO = "email.error.to";
	public static final String PROP_NAME_MAIL_FROM = "email.error.from";
	public static final String PROP_NAME_MAIL_SUBJECT = "email.error.subject";	
	
	//
	// core spring profile names. one of the two should be active. Controlled by property during build process.
	//
	public static final String ENV_PRODUCTION = "production";
	public static final String ENV_DEVELOPMENT = "development";
	
}
