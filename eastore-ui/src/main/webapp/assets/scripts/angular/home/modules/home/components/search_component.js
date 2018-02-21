(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for the search state
	//
	mainModule.component('searchHeaderComponent', {
		
		bindings: {
			stores : '<',
			searchModel : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/search_header.jsp';
		},			
		
		controller : function($log, $state){
			
			var thisCtrl = this;		
			
		},
		
		controllerAs : 'searchCtrl' // default is $ctrl
		
	});	
	
	//
	// content for the search state
	//
	mainModule.component('searchContentComponent', {
		
		bindings: {
			stores: '<',
			searchModel : '<'	
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/search_content.jsp';
		},				
		
		controller : function($log, $state, $window, appConstants){
			
			var thisCtrl = this;
			
			// fired when the user changes which store they are searching
			this.storeChange = function(){
				
				$log.debug('Store changed to ' + thisCtrl.searchModel.selectedStore.name);
				
			};

			this.handleSearch = function(event){
				
				//$log.debug('key code = ' + event.keyCode);
				//$log.debug('input => ' + thisCtrl.searchModel.searchText);
				
				if(event.keyCode == 13 && thisCtrl.searchModel.searchText.length > 3){
					$log.debug('search for => ' + thisCtrl.searchModel.searchText);
				}
				
			};
			
		},
		
		controllerAs : 'searchCtrl' // default is $ctrl
		
	});	
	
})();	