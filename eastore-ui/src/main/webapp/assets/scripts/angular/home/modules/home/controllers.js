(function(){

	var eastoreModule = angular.module('eastore-ui-main');

	eastoreModule
		.controller('navController',[
			'appConstants', '$mdSidenav', '$mdUtil', '$log', NavController
			]
		);	
	
	eastoreModule
		.controller('homeController',[
			'appConstants', '$scope', '$state', '$stateParams', '$mdSidenav', '$mdUtil', '$log', 'EAStomp', HomeController
			]
		);
		
	//
	// controller for opening and closing nav bar. This should be done inside our "rootComponent" (see components.js)
	// but for some reason I can't get the open/closing toggle method to work there...
	//
	function NavController(appConstants, $mdSidenav, $mdUtil, $log){
		
		function _buildTheToggle(navId) {
			$log.debug('_buildTheToggle for nav ' + navId);
			return $mdUtil.debounce(function(){
				$log.debug('here');
				$mdSidenav(navId)
					.toggle()
					.then(function () {
						$log.debug("toggle " + navId + " is done");
					});
			},300);
		};		
	
		var self = this;
		
		/*
		 * External API
		 */
		return {
		
			toggleNav : _buildTheToggle(appConstants.leftNavComponentId)
			
		}		
		
	}
		
	//
	// Default controller which sets up rotating banner images, and left-hand navigation bar
	//
	function HomeController(
		appConstants, $scope, $state, $stateParams, $mdSidenav, $mdUtil, $log, EAStomp) {
   
   
		/****************************************************************************************
		 * Internal models bound to UI
		 */     

		// stomp messaging over websockets
		var myStomp;
		
		/****************************************************************************************
		 * On application load:  load all resource stores when page loads (asynchronously)
		 */		
		_handleOnPageLoad();

		function _handleOnPageLoad(){
			
			//$log.debug('Loading index page');
			
			//_doWebSocketTest();
			
		}
		
		function _doWebSocketTest(){
			$log.debug('peforming websocket test');
			_initSocket();	
		}
		function _initSocket(){
			$log.debug('initializing websocket');
			$log.debug('setting up sockjs endpoint for ' + appConstants.eastoreStompSockJsUrl);
			myStomp = new EAStomp({
				sockJsUrl: appConstants.eastoreStompSockJsUrl
			});
			myStomp.setDebug(_myStompDebug);
			myStomp.connect(_myStompConnect, _myStompConnectError);
		}
		function _myStompDebug(str){
			$log.debug('STOMP Debug = ' + str);	
		}		
		function _myStompConnect(frame){
			var subscriptTest = myStomp.subscribe('/topic/test', _myStompReceiveTestMessages);
			var subscriptResourceChange = myStomp.subscribe('/topic/resource/change', _myStompReceiveResourceChangeMessages);
		}
		function _myStompConnectError(error){
			$log.debug('_onStompConnectError...');
			//$log.debug(error.headers.message);
			$log.debug('STOMP Error = ' + JSON.stringify(error));
		}
		function _myStompReceiveTestMessages(socketMessage){
			$log.info('STOMP Received = ' + JSON.stringify(socketMessage));
		}
		function _myStompReceiveResourceChangeMessages(socketMessage){
			
			$log.info('STOMP Resource Changed = ' + JSON.stringify(socketMessage));
			
			// reload current state (will re-resolve data)
			$state.reload();
			
		}	
	
		var self = this;
		
		/*
		 * External API
		 */
		return {
			
			
		}

	}

})();