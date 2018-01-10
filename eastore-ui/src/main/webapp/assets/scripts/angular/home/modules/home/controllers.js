(function(){

	var eastoreModule = angular.module('eastore-ui-main');

	eastoreModule
		.controller('appController',[
			'appConstants', '$mdSidenav', '$mdUtil', '$log', AppController
			]
		);
	
	/**
     * Setup toggle for side nav bar. Ideally this should be in our root component.... Work on fixing this later.
	 */
	function AppController(appConstants, $mdSidenav, $mdUtil, $log){
		
		var self = this;
		
		doInit();
		
		function doInit(){
			
			$log.debug('Initializing AppController');
			
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