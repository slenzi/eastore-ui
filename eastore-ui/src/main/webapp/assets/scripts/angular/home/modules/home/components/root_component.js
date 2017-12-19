(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// template for root view. this is the parent component which renders the side nav, and sets up
	// the child ui-view elements for all our other child states & components
	//
	mainModule.component('rootComponent', {
		
		bindings: {
			leftnavid : '<',
			eastomp : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath + '/assets/scripts/angular/home/modules/home/views/root.jsp'
		},

		controller : function(appConstants, $log, $mdSidenav, $mdUtil, $state, EAStomp){
			
			var thisCtrl = this;
			
			var stompClient;
			
			this.$onInit = function() {
				
				$log.debug('rootComponent controller');
				
				thisCtrl.initializeStompMessaging();
				
			};
			
			this.leftNavComponentId = appConstants.leftNavComponentId;
			
			// banner images to cycle through
			this.bannerImages = new Array();
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});			
			
			// for some reason this isn't working, so we setup a separate controller for opening/closing the nav
			// menu. see 'nacController' in controllers.js
			//
			// toggle the nav bar with the specified id
			this.toggleNav = function(navId){
				return this.buildToggler(navId);
				//return function() {
				//	$log.debug('yo');
				//	$mdSidenav(navId).toggle();
				//};				
			};
			
			//builds a toggle switch for opening/closing navigation bar
			this.buildToggler = function(navId) {
				$log.debug('buildToggler for nav ' + navId);
				return $mdUtil.debounce(function(){
					$log.debug('here');
					$mdSidenav(navId)
						.toggle()
						.then(function () {
							$log.debug("toggle " + navId + " is done");
						});
				},300);
			};

			// close the nav bar with the specified id
			this.closeNav = function(navId) {
				$log.debug('close nav ' + navId);
				$mdSidenav(navId).close()
				.then(function () {
					//$log.debug("close MyLeftNav is done");
				});
			};
			
			this.initializeStompMessaging = function(){
				
				$log.debug('initializing Stomp messaging');
				
				thisCtrl.stompClient = new EAStomp({
                    sockJsUrl: appConstants.eastoreStompSockJsUrl
                });
				thisCtrl.stompClient.setDebug(thisCtrl._stompSocketDebug);
				thisCtrl.stompClient.connect(thisCtrl._myStompConnect, thisCtrl._myStompConnectError);				
				
			};
			
			this._stompSocketDebug = function(str){
		        $log.debug('STOMP Debug = ' + str);
			};
			this._myStompConnect = function(frame){
		        var subscriptTest = thisCtrl.stompClient.subscribe(
		        		'/topic/test', thisCtrl._myStompReceiveTestMessages);
		        var subscriptResourceChange = thisCtrl.stompClient.subscribe(
		        		'/topic/resource/change', thisCtrl._myStompReceiveResourceChangeMessages);
			};
			this._myStompConnectError = function(error){
		        $log.debug('_onStompConnectError...');
		        //$log.debug(error.headers.message);                                                                                                                                                                                                                    
		        $log.debug('STOMP Error = ' + JSON.stringify(error));
			};
			this._myStompReceiveTestMessages = function(socketMessage){
		        $log.info('STOMP Received = ' + JSON.stringify(socketMessage));
			};
			this._myStompReceiveResourceChangeMessages = function(socketMessage){
		        
				$log.info('STOMP Resource Changed = ' + JSON.stringify(socketMessage));
				
				if($state){
			        $log.info('Current state = ' + $state.current.name);
			        
			        if($state.current.name === 'path'){
			                // reload the 'path' state so user sees updated data that changed on server                                                                                                                                                                     
			                $state.reload();
			        }					
				}else{
					$log.debug('Cannot refresh state, no $state defined');
				}
				
			};			
					
		},
		
		controllerAs : 'rootCtrl' // default is $ctrl		
		
	});

})();