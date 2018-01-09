(function(){

	var eastoreModule = angular.module('eastore-ui-main');

	eastoreModule
		.controller('appController',[
			'appConstants', '$mdSidenav', '$mdUtil', '$log', 'stompService', AppController
			]
		);
	
	/**
     * Bootstrap our stomp messaging service, and setup toggle for side nav bar.
	 */
	function AppController(appConstants, $mdSidenav, $mdUtil, $log, stompService){
		
		var self = this;
		
		doInit();
		
		function doInit(){
			
			$log.debug('Initializing AppController');
			
			stompService.initializeStompMessaging();
			
		};
		
		function _buildTheToggle(navId) {
			//$log.debug('_buildTheToggle for nav ' + navId);
			return $mdUtil.debounce(function(){
				//$log.debug('here');
				$mdSidenav(navId)
					.toggle()
					.then(function () {
						//$log.debug("toggle " + navId + " is done");
					});
			},300);
		};	
		
		/*
		 * External API
		 */
		return {
		
			toggleNav : _buildTheToggle(appConstants.leftNavComponentId)
			
		}		
		
	}

})();