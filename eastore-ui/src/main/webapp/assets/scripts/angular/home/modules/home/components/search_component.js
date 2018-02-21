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
		
		controller : function($log, $state, $window, appConstants, homeRestService, sharedDataService){
			
			var thisCtrl = this;
			
			// fired when the user changes which store they are searching
			this.storeChange = function(){
				
				$log.debug('Store changed to ' + thisCtrl.searchModel.selectedStore.name);
				
			};

			this.handleSearch = function(event){
				
				if(event.keyCode == 13 && thisCtrl.searchModel.searchText.length > 3){
					
					sharedDataService.setProgressBarEnabled(true);
					
					var storeId = thisCtrl.searchModel.selectedStore.id;
					var searchText = thisCtrl.searchModel.searchText;
					
					homeRestService
						.searchBasicContent(storeId, searchText)
						.then( function ( jsonData ){
							
							$log.debug('Search results = ' + JSON.stringify(jsonData));
							
							if(jsonData.hits != null){
								thisCtrl.searchModel.searchResults = jsonData.hits;
							}else{
								thisCtrl.searchModel.searchResults = [];
							}
							
							sharedDataService.setProgressBarEnabled(false);
							
						}, function( error ){
							alert('Error perform search' + JSON.stringify(error));
						});						
					
				}
				
			};
			
			this.downloadFile = function(fileId){
				
				homeRestService.downloadFile(fileId);				
				
			};
			
			this.loadDirectory = function(storeName, dirRelativePath){
				
				var newUrlPath = '/' + storeName + dirRelativePath;				
				
				/*
				$state.go('path', {
					urlPath: newUrlPath,
					//relPath: newRelPath,
					//store : theStore,
					//currDirResource : rootDirectory
					});
				*/
				
				// if you change /spring/private/main/home the you also need to change it in index.jsp
				var url = appConstants.applicationUrl + '/spring/private/main/home' + $state.href('path', {urlPath: newUrlPath});
				
				$log.debug('url = ' + url);
				
				$window.open(url, '_blank');
				
			};
			
		},
		
		controllerAs : 'searchCtrl' // default is $ctrl
		
	});	
	
})();	