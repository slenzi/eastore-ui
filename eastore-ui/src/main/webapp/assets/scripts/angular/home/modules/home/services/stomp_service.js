(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule.factory('stompService', ['$log', '$state', 'appConstants', 'resolveService', 'sharedDataService', 'EAStomp', StompService]);
	
	/**
	 * Service for initializing stomp messaging over web sockets. We use this in path_resource_component.js
	 */
	function StompService($log, $state, appConstants, resolveService, sharedDataService, EAStomp){
		
		var _stompClient;
		
		var _isInitialized = false;
		
		function initializeStompMessaging(){
			
			if(!_isInitialized){
				
				$log.debug('Initializing Stomp messaging');
				
				/*
				const clientOptions = {};
				
				Object.defineProperty(clientOptions, 'sockJsUrl', {
					value : appConstants.eastoreStompSockJsUrl,
					writable : false
				});
				Object.defineProperty(clientOptions, 'stompHeaders', {
					value : 'How Now Brown Cow!',
					writable : false
				});
				Object.defineProperty(clientOptions, 'sessionId', {
				    get: function() {
				    	var newSessionId = 'fubar_' + (Math.random() + 1).toString(36).substring(10);
				    	$log.debug('SockJs Session id = ' + newSessionId);
				        return newSessionId;
				    },
				    enumerable: true
				});				
				
				_stompClient = new EAStomp(clientOptions);
				*/
				
				_stompClient = new EAStomp({
	                sockJsUrl: appConstants.eastoreStompSockJsUrl,
	                sockJsOptions : {
	                	// currently not being utilized, angular.extend function inside estomp module is not able to copy this function
	                	sessionId : function(){
	                		var newSessionId = 'fubar_' + (Math.random() + 1).toString(36).substring(10);
	                		$log.debug('SockJs Session id = ' + newSessionId);
	                		return newSessionId;
	                	}
	                },
	                stompHeaders: {
	                	userId: 'How Now Brown Cow!'
	                }
	            });
				
				_stompClient.setDebug(stompSocketDebug);
				_stompClient.connect(myStompConnect, myStompConnectError);
				_isInitialized = true;
			}			
			
		}
		
		function stompSocketDebug(str){
	        $log.debug('STOMP Debug = ' + str);
		}
		
		function myStompConnect(frame){
	    
			// only eastore has a /topic/test subscription, not eastore-ui
			//var subscriptTest = _stompClient.subscribe('/topic/test', receiveTestMessages);
	        
			var subscriptResourceChange = _stompClient.subscribe('/topic/resource/change', receiveResourceChangeMessages);
			
			var subscriptSocketConnect = _stompClient.subscribe('/topic/action/socket/connect', receiveSocketConnectReplyMessages);
		
			setInterval(sendConnectedMessage, 5000);
	        
		}
		
		function sendConnectedMessage(){
			
			$log.debug('Sending connected stomp mesage...');
			
	        // send connect message to server and pass user id
	        var connectMessage = {
	        	userId: 'sample user id'
	        };
	        var jsonString = JSON.stringify(connectMessage);
	        $log.debug("Sending => " + jsonString);
	        _stompClient.send("/app/action/socket/connect", {}, jsonString);			
			
		}
		
		function myStompConnectError(error){
			//$log.debug('_onStompConnectError...');
	        //$log.debug(error.headers.message);                 
	        $log.debug('STOMP Error = ' + JSON.stringify(error));
		}
		
		function receiveTestMessages(socketMessage){
	        $log.info('STOMP Received = ' + JSON.stringify(socketMessage));
		}
		
		function receiveSocketConnectReplyMessages(socketMessage){
			$log.info('STOMP socket connect reply = ' + JSON.stringify(socketMessage));
		}
		
        function receiveResourceChangeMessages(socketMessage){

            $log.info('STOMP Resource Changed = ' + JSON.stringify(socketMessage));

            var messageData = JSON.parse(socketMessage.body);
            $log.info('messageData = ' + JSON.stringify(messageData));

            //if($state && $stateParams && messageData && $stateParams.currDirResource){

            $log.debug('Current state = ' + $state.current.name);

            var messageCode = messageData.code;
            var messageNodeId = messageData.nodeId;
            //var currDirId = $stateParams.currDirResource.nodeId;
            var currStore = sharedDataService.getStore();
            var currDir = sharedDataService.getDirectory();
            var currDirId = currDir.nodeId;

            $log.debug('messageCode = ' + messageCode + ', messageNodeId = ' + messageNodeId + ', currDirId = ' + currDirId);

            // Don't really want to re-load the entire state because that will re-fetch all resolves, including the resolves
            // for the parent 'root' state which contains the stomp web socket component, essentially closing and
            // re-establishing the web socket connection. Instead we'll try to re-resolve just the path resources for
            // the 'path' state

            // $state.reload();

            //
            // Re-resolve the 'pathresources' for the 'path' state (see app.js setup for states & resolves)
            // Only re-resolve if the current state is 'path' and the current working directory stored in
            // the $stateParams object matches the directory ID in the STOMP directory change message
            //

            if($state.current.name === 'path' && messageCode == 'DIRECTORY_CONTENTS_CHANGED' && currDirId === messageNodeId){

                $log.debug('reload path resources!');
				
				resolveService.resolvePathResourcesForDirectory(currStore, currDir).then(function (data){
					sharedDataService.setPathResources(data);
				});                
				
            }
			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			initializeStompMessaging : initializeStompMessaging
			
		};		
		
	}	
	
})();