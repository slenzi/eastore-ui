(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-login');
	
	mainModule.component('rootLoginComponent', {
		
		bindings: { },
		
		templateUrl : function (appConstants){
			return appConstants.contextPath + '/assets/scripts/angular/home/modules/login/views/root.jsp'
		},

		controller : function(appConstants, $log, $mdSidenav, $mdUtil, $location, $state, sharedDataService){
			
			var thisCtrl = this;
			
			this.$onInit = function() {
				
				$log.debug('rootLoginComponent controller');
				
			};
					
		},
		
		controllerAs : 'rootCtrl' // default is $ctrl		
		
	});

})();