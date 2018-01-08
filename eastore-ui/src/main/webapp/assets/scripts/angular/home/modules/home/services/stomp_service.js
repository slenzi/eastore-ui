(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule.factory('stompService', ['$log', 'appConstants', 'resolveService', 'sharedDataService', 'EAStomp', '$state', '$stateParams', StompService]);
	
	/**
	 * Service for initializing stomp messaging over web sockets
	 */
	function StompService($log, appConstants, resolveService, sharedDataService, $state, $stateParams, EAStomp){
		
		var _stompClient;
		
		function initializeStompMessaging(){
			
			$log.debug('Initializing Stomp messaging');
			
			_stompClient = new EAStomp({
                sockJsUrl: appConstants.eastoreStompSockJsUrl
            }); 
			_stompClient.setDebug(this.stompSocketDebug);
			_stompClient.connect(this.myStompConnect, this.myStompConnectError);				
			
		}
		
		function stompSocketDebug(str){
	        $log.debug('STOMP Debug = ' + str);
		}
		
		function myStompConnect(frame){
	        var subscriptTest = _stompClient.subscribe('/topic/test', this.myStompReceiveTestMessages);
	        var subscriptResourceChange = _stompClient.subscribe('/topic/resource/change', this.myStompReceiveResourceChangeMessages);
		}
		
		function myStompConnectError(error){
			//$log.debug('_onStompConnectError...');
	        //$log.debug(error.headers.message);                 
	        $log.debug('STOMP Error = ' + JSON.stringify(error));
		}
		
		function myStompReceiveTestMessages(socketMessage){
	        $log.info('STOMP Received = ' + JSON.stringify(socketMessage));
		}
		
        function myStompReceiveResourceChangeMessages(socketMessage){

            $log.info('STOMP Resource Changed = ' + JSON.stringify(socketMessage));

            var messageData = JSON.parse(socketMessage.body);
            $log.info('messageData = ' + JSON.stringify(messageData));

            if($state && $stateParams && messageData && $stateParams.currDirResource){

                $log.debug('Current state = ' + $state.current.name);

                var messageCode = messageData.code;
                var messageNodeId = messageData.nodeId;
                var currDirId = $stateParams.currDirResource.nodeId;

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
					
					// re-resolved the path resources and load them into our shared data service.
					//resolveService.resolvePathResources($stateParams).then(function (data){
					//	sharedDataService.setPathResources(data);
					//});
					
                }
				
			}else{
				
				$log.error('Cannot re-resolve \'pathresources\' for \'path\' state, no $state, $stateParams, and/or $transition$ dependency.');
				
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