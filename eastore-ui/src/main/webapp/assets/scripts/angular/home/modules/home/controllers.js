(function(){

	angular
		.module('eastore-ui-main')
		.controller('homeController',[
			'appConstants', '$scope', '$state', '$stateParams', '$mdSidenav', '$mdUtil', '$log', 'EAStomp', HomeController
			]
		);
		
	//
	// Default controller which sets up rotating banner images, and left-hand navigation bar
	//
	function HomeController(
		appConstants, $scope, $state, $stateParams, $mdSidenav, $mdUtil, $log, EAStomp) {
   
   
		/****************************************************************************************
		 * Internal models bound to UI
		 */
		var _sectionTitle = "Not set";	
		
		// will be true when data is being loaded from server web service
		var _isLoadingDataFlag = false;
		
		$scope.leftNavComponentId = appConstants.leftNavComponentId;

		// banner images to cycle through
		$scope.bannerImages = new Array();
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});        

		// stomp messaging over websockets
		var myStomp;
		
		/****************************************************************************************
		 * On application load:  load all resource stores when page loads (asynchronously)
		 */		
		_handleOnPageLoad();

		function _handleOnPageLoad(){
			
			$log.debug('Loading index page');
			
			_doWebSocketTest();
			
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
			var testSubscription = myStomp.subscribe('/topic/tests', _myStompReceiveTestMessages);
		}
		function _myStompConnectError(error){
			$log.debug('_onStompConnectError...');
			//$log.debug(error.headers.message);
			$log.debug('STOMP Error = ' + JSON.stringify(error));
		}
		function _myStompReceiveTestMessages(socketMessage){
			$log.info('STOMP Received = ' + JSON.stringify(socketMessage));
		}		
		
		/**
		 * Loads an angular-ui state, with the provided state parameters
		 */
		function _loadState(state, params){
			$state.go(state, params);
		}
		
		/**
		 * Builds a toggle switch for opening/closing navigation bar
		 */
		function _buildToggler(navID) {
			var debounceFn = $mdUtil.debounce(function(){
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					//$log.debug("toggle " + navID + " is done");
				});
			},300);
			return debounceFn;
		}
		
		/**
		 * Closes our left-hand navigation bar
		 */
		function _leftNavClose() {
			$mdSidenav(appConstants.leftNavComponentId).close()
			.then(function () {
				//$log.debug("close MyLeftNav is done");
			});
		};
	
		var self = this;
		
		/*
		 * External API
		 */
		return {
			
			toggleLeftNav : _buildToggler(appConstants.leftNavComponentId),
			
			leftNavClose : _leftNavClose
			
		}

	}

})();