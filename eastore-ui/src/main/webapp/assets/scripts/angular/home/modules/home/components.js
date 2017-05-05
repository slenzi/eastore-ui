(function(){
	
	'use strict';
	
	var mainModule = angular.module('prodoc-main');
	
	//
	// template for the left-hand navbar menu
	//
	mainModule.component('leftMenuComponent', {
		
		bindings: { headerTitle: '<' },
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/left_menu.jsp',
		
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
			
			this.clickProtList = function(){
				
				$state.go('prot');
				
			};
			
		},
		
		controllerAs : 'lmenuCtrl' // default is $ctrl
		
	});	
	
	//
	// template for the title header on every page
	//
	mainModule.component('titleHeaderComponent', {
		
		bindings: { headerTitle: '<' },
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/title_header.jsp',
		
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
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp',
		
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
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp',
		
		controller : function($log, $state){
			
			//$log.debug('storesContentComponent controller');
			
			this.clickStoreHandler = function(theStore){
				
				alert('You clicked on store:\n\n' + JSON.stringify(theStore));
				
				//var relPathToLoad = '/docs/' + prot.prot;
				
				//$log.debug('current state = ' + JSON.stringify($state.current));
				
				//$log.debug('transitioning to \'path\' state ');
				
				$state.go('path', {
					relPath: '/' + theStore.name,
					store : theStore
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
				breadcrumb: '<'
		},
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/path_header.jsp',
		
		controller : function($log, $state, $stateParams){
			
			//$log.debug('pathHeaderComponent controller');
			
			this.clickBreadcrumb = function(resource){
				
				// breadcrumb path resources should always be of resourceType DIRECTORY.
				
				$log.debug('You clicked on breadcrumb path resource:\n\n' + JSON.stringify(resource));
				
				this.loadDirectory(resource);
				
			};
			
			this.loadDirectory = function(resource){
				
					var docsPrefix = '/docs';
					var relPathToLoad = resource.relativePath;
					if(relPathToLoad.startsWith(docsPrefix)){
						relPathToLoad = relPathToLoad.substring(relPathToLoad.indexOf(docsPrefix) + docsPrefix.length);
					}
					
					$log.debug('State refresh, new relPath = ' + relPathToLoad);
					
					$stateParams.relPath = relPathToLoad;
					
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
		
		bindings: { pathresources: '<' },
		
		templateUrl : '/prodoc/assets/scripts/angular/home/modules/home/partials/path_content.jsp',
		
		controller : function($log, $state, $stateParams, homeRestService){
			
			//$log.debug('pathContentComponent controller');
			
			this.clickResourceHandler = function(resource){
				
				if(resource.resourceType === 'FILE'){
					
					homeRestService.downloadFile(resource.nodeId);
				
				}else if(resource.resourceType === 'DIRECTORY'){
				
					$log.debug('You clicked on directory path resource:\n\n' + JSON.stringify(resource));
					
					$log.debug(JSON.stringify($stateParams));
					
					var docsPrefix = '/docs';
					var relPathToLoad = resource.relativePath;
					if(relPathToLoad.startsWith(docsPrefix)){
						relPathToLoad = relPathToLoad.substring(relPathToLoad.indexOf(docsPrefix) + docsPrefix.length);
					}
					
					$log.debug('State refresh, new relPath = ' + relPathToLoad);
					
					$stateParams.relPath = relPathToLoad;
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});					
					
					//$state.go('path', {
					//	relPath: relPathToLoad
					//	});					
					
				}else{

					alert('You clicked on a path resource with an unrecognized resource type:\n\n' + JSON.stringify(resource));

				}
				
				// TODO - need to somehow reload same state that we are currently in, but after fetching lastest path resource data from server
				
				// http://stackoverflow.com/questions/21714655/reloading-current-state-refresh-data
				
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