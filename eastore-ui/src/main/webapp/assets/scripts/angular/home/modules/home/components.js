(function(){
	
	'use strict';
	
	var mainModule = angular.module('prodoc-main');
	
	//
	// template for the left-hand navbar menu
	//
	mainModule.component('leftMenuComponent', {
		
		bindings: { headerTitle: '<' },
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/left_menu.jsp',
		
		controller : function($log, $state, homeRestService){
			
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
			
			this.clickStoreList = function(){
				
				$state.go('stores');
				
			};
			
		},
		
		controllerAs : 'lmenuCtrl' // default is $ctrl
		
	});	
	
	//
	// template for the title header on every page
	//
	mainModule.component('titleHeaderComponent', {
		
		bindings: { headerTitle: '<' },
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/title_header.jsp',
		
		controller : function($log){
			//$log.debug('titleHeaderComponent controller');
		},
		
		controllerAs : 'titleCtrl' // default is $ctrl
		
	});
	
	//
	// header for store list state
	//
	mainModule.component('storeListHeaderComponent', {
		
		bindings: { stores: '<' },
		
		//template :
		//	'Protocol List'
		//,
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp',
		
		controller : function($log){
			//$log.debug('storesHeaderComponent controller');
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
	//
	// content for store list state
	//
	mainModule.component('storeListContentComponent', {
		
		bindings: { stores: '<' },
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp',
		
		controller : function($log, $state){
			
			//$log.debug('storesContentComponent controller');
			
			this.clickStoreHandler = function(theStore){
				
				//alert('You clicked on store:\n\n' + JSON.stringify(theStore));
				//$log.debug('current state = ' + JSON.stringify($state.current));
				//$log.debug('transitioning to \'path\' state ');
				
				var rootDirectory = theStore.rootDir;
				var newRelPath = rootDirectory.relativePath;
				var newUrlPath = '/' + theStore.name + newRelPath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					relPath: newRelPath,
					store : theStore,
					currDirResource : rootDirectory
					});
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});

	//
	// header for path resource list state
	//
	mainModule.component('pathHeaderComponent', {
		
		bindings: {
				pathresources: '<',
				breadcrumb: '<',
				store: '<'
		},
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/path_header.jsp',
		
		controller : function($log, $state, $stateParams){
			
			//$log.debug('pathHeaderComponent controller');
			
			this.clickBreadcrumb = function(store, resource){
				
				// breadcrumb path resources should always be of resourceType DIRECTORY.
				
				$log.debug('You clicked on breadcrumb path resource:\n\n' + JSON.stringify(resource));
				
				this.loadDirectory(store, resource);
				
			};
			
			this.loadDirectory = function(store, resource){
					
					//$stateParams.relPath = resource.relativePath;
					$stateParams.currDirResource = resource;
					//$stateParams.urlPath = $stateParams.urlPath + '/' + resource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + resource.relativePath;
					$stateParams.urlPath = '/' + store.name + resource.relativePath;
					
					$log.debug('breadcrumb click, dirNodeId = ' + $stateParams.currDirResource.nodeId + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});
				
			};		
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});

	//
	// content for path resource list state
	//
	mainModule.component('pathContentComponent', {
		
		bindings: {
			pathresources: '<',
			store: '<'
		},
		
		templateUrl : '@application.context@/assets/scripts/angular/home/modules/home/partials/path_content.jsp',
		
		controller : function($log, $state, $stateParams, homeRestService){
			
			//$log.debug('pathContentComponent controller');
			
			this.clickResourceHandler = function(store, resource){
				
				if(resource.resourceType === 'FILE'){
					
					homeRestService.downloadFile(resource.nodeId);
				
				}else if(resource.resourceType === 'DIRECTORY'){
				
					//$log.debug('You clicked on directory path resource:\n\n' + JSON.stringify(resource));
					//$log.debug(JSON.stringify($stateParams));
					
					$stateParams.relPath = resource.relativePath;
					$stateParams.currDirResource = resource;
					//$stateParams.urlPath = $stateParams.urlPath + '/' + resource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + resource.relativePath;
					$stateParams.urlPath = '/' + store.name + resource.relativePath;
					
					$log.debug('directory click, dirNodeId = ' + $stateParams.currDirResource.nodeId + 
						', relPath = ' + $stateParams.relPath + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});				
					
				}else{

					alert('You clicked on a path resource with an unrecognized resource type:\n\n' + JSON.stringify(resource));

				}
				
			};
			
			// iterate over the array of pathResource and return true if any of them are resourceType DIRECTORY
			this.haveDirectoryResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'DIRECTORY'){
						return true;
					}
				}
			};
			
			// iterate over the array of pathResource and return true if any of them are resourceType FILE
			this.haveFileResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'FILE'){
						return true;
					}
				}
			};			
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});	
	
})();