/**
 * 
 */
package org.eamrf.eastore.ui.core.socket.messaging.util;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Service class for mapping users to their websocket connections
 * 
 * @author slenzi
 */
public class StompSessionTracker {

	// keys = websocket principal user id
	// values = ecog-acrin user id (i.e. ctep id)
	Map<String, String> mapPrincipalToUser = new HashMap<String, String>();
	
	// keys = values = ecog-acrin user id (i.e. ctep id)
	// values = set of websocket principal user id
	Map<String, HashSet<String>> mapUserToPrincipal = new HashMap<String, HashSet<String>>();
	
	public StompSessionTracker() {
		
	}
	
	/**
	 * Get the ecog-acrin user id for the websocket principal user id
	 * 
	 * @param principalUserId - the principal user id / name for the session
	 * @return
	 */
	public String getUserId(String principalUserId) {
		return mapPrincipalToUser.get(principalUserId);
	}	
	
	/**
	 * get set of all ecog-acrin user ids being tracked
	 * 
	 * @return
	 */
	public Set<String> getUserIds() {
		return mapUserToPrincipal.keySet();
	}	
	
	/**
	 * Get set of all websocket principal user ids being tracked
	 * 
	 * @return
	 */
	public Set<String> getPrincipalUserIds() {
		return mapPrincipalToUser.keySet();
	}
	
	/**
	 * Get set of all websocket principal user ids for the logged in user.
	 * 
	 * @param userId - the ecog-acrin user id (i.e. ctep id)
	 * @return
	 */
	public Set<String> getPrincipalUserIdsForUser(String userId){
		return mapUserToPrincipal.get(userId);
	}
	
	/**
	 * Track the websocket session for the user
	 * 
	 * @param principalUserId - the principal user id / name for the session
	 * @param userId - the ecog-acrin user id (i.e. ctep id)
	 */
	public void addSession(String principalUserId, String userId) {
		
		mapPrincipalToUser.put(principalUserId, userId);
		
		if(mapUserToPrincipal.containsKey(userId)) {
			mapUserToPrincipal.get(userId).add(principalUserId);
		}else {
			HashSet<String> principalList = new HashSet<String>();
			principalList.add(principalUserId);
			mapUserToPrincipal.put(userId, principalList);
		}		
		
	}
	
	/**
	 * Untrack the websocket session for the user
	 * 
	 * @param principalUserId - the principal user id / name for the session
	 */
	public void removeSession(String principalUserId) {
		
		if(mapPrincipalToUser.containsKey(principalUserId)) {
			String userId = mapPrincipalToUser.get(principalUserId);
			mapPrincipalToUser.remove(principalUserId);
			if(mapUserToPrincipal.containsKey(userId)) {
				mapUserToPrincipal.get(userId).remove(principalUserId);
			}
		}
		
	}

}
