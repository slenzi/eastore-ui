(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for store list state
	//
	mainModule.component('storeListHeaderComponent', {
		
		bindings: {
			stores: '<',
			isAdmin: '<'
		},
		
		//template :
		//	'Protocol List'
		//,
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp';
		},			
		
		controller : function($log, $state){
			
			//$log.debug('storesHeaderComponent controller');
			
			var thisCtrl = this;
			
			this.isAdminUser = function(){
				return thisCtrl.isAdmin;
			};
			
			// show the create store form
			this.showCreateStoreForm = function(){
				
				$state.go('createstore');
		
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
	//
	// content for store list state
	//
	mainModule.component('storeListContentComponent', {
		
		bindings: {
			stores: '<',
			isAdmin: '<'			
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp';
		},				
		
		controller : function($log, $state, $window, appConstants){
			
			//$log.debug('storesContentComponent controller');
			
			var thisCtrl = this;
			
			this.isAdminUser = function(){
				return thisCtrl.isAdmin;
			};			
			
			this.clickStoreHandler = function(theStore){
				
				//alert('You clicked on store:\n\n' + JSON.stringify(theStore));
				//$log.debug('current state = ' + JSON.stringify($state.current));
				//$log.debug('transitioning to \'path\' state ');
				
				var rootDirectory = theStore.rootDir;
				var newRelPath = rootDirectory.relativePath;
				var newUrlPath = '/' + theStore.name + newRelPath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					//relPath: newRelPath,
					store : theStore,
					currDirResource : rootDirectory
					});
				
			};
			
			this.clickEditStoreHandler = function(theStore){
				
				$state.go('editstore', {
					editStore : theStore
					});
					
			};
			
			// show the admin tree view for the entire store
			this.showStoreTreeView = function(theStore){
				var rootDirId = theStore.rootDir.nodeId;
				$window.open(appConstants.eastoreUiTreeJaxrsService + '/download/dirId/' + rootDirId, '_blank');
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
})();	