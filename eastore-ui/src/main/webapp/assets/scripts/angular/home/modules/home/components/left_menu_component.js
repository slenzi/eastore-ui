(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// template for the left-hand navbar menu
	//
	mainModule.component('leftMenuComponent', {
		
		bindings: { headerTitle: '<' },
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/left_menu.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/left_menu.jsp';
		},			
		
		controller : function(appConstants, $mdSidenav, $log, $state, homeRestService, sharedDataService){
			
			//$log.debug('leftMenuComponent controller');
			
			this.clickEchoTest = function(){
				
				homeRestService
					.echo('testing 1 2 3...')
					.then( function ( jsonData ){
						$log.debug('Result from echo() => ' + JSON.stringify(jsonData));
					}, function( error ){
						alert('Error calling echo() service method' + JSON.stringify(error));
					});				
				
			};
			
			// load view which shows a list of all stores
			this.clickStoreList = function(){
				
				$state.go('stores');
				closeSideNav();
				
			};
			
			// load search view
			this.clickLoadSearchView = function(){
				
				$state.go('search');
				closeSideNav();
				
			};
			
			// close the side nav
			this.closeSideNav = function(){
				
				if($mdSidenav(appConstants.leftNavComponentId).isOpen()){
					$mdSidenav(appConstants.leftNavComponentId).close();
				}					
				
			};
			
			// method used during development and testing phase
			//this.toggleProgress = function(){
			//	
			//	sharedDataService.setProgressBarEnabled(!sharedDataService.isProgressBarEnabled());
			//	
			//};
			
		},
		
		controllerAs : 'lmenuCtrl' // default is $ctrl
		
	});	
	
})();	