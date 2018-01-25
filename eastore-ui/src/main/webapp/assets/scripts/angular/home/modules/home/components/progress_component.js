(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for path resource list state
	//
	mainModule.component('progressComponent', {
		
		//
		// < : one-way data binding
		// = : two-way data binding
		//
		bindings: {
		
				
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/progress.jsp';
		},

		controller : function($log, $scope, $state, $stateParams, sharedDataService){
			
			var thisCtrl = this;
			
			this.getStyle = function(){
				return sharedDataService.getProgressBarStyle();
			};
			
			this.getValue = function(){
				return sharedDataService.getProgressBarValue();
			};
			
			this.isEnabled = function(){
				return sharedDataService.isProgressBarEnabled();
			};
			
		},
		
		controllerAs : 'progCtrl' // default is $ctrl
		
	});			
	
})();	