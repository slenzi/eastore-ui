(function(){
	
	'use strict';
	
	var homeApp;
	
	/**
	 * Initialize application.
	 * 
	 * ECOG-ACRIN Modules:
	 * 
	 * eastore-ui-main ---- Our main module
	 * eastore-ui-util ---- Utility module
	 * ea-upload-module --- File upload module
	 * 
	 * Third Party Modules:
	 * 
	 * ui.router ----- Routing frameworks, essentially more powerful version of built in ngRoute.
	 * ngMaterial ---- Material design UI components
	 * ngResource ---- Provides interaction support with RESTful services via the $resource service
	 * smart-table --- Lightweight table module
	 * 
	 */
	homeApp = angular
		.module('eastore-ui-home-app',
				[
				 'ui.router', 'ngMaterial', 'ngResource', 'eastore-ui-main', 'eastore-ui-util', 'ea-upload-module', 'smart-table'
				 ])
		// @xyz@ values are replaced/filtered by maven during build process
		.constant('appConstants', {
			contextPath: '@application.context@',
			applicationUrl: '@application.url@',
			eaStoreName: '@ea.store.name@',
			eastoreuiJaxrsService: '@eastoreui.jax.rs.service@',
			leftNavComponentId : 'MyLeftNav',
			httpUploadHandler : 'url for upload handler goes here'
		})
		// inject our own constants into our config
		.config(['appConstants', '$locationProvider', '$mdThemingProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', appConfig]);
	
		/**
		 * Main app config
		 *
		 * appConstants - our own application constants
		 * $locationProvider - default angular location provider
		 * $mdThemingProvider - Angular material theme setup
		 * $stateProvider - angular ui.router state provider
		 * $urlRouterProvider - angualr ui.router url provider
		 */
		function appConfig(appConstants, $locationProvider, $mdThemingProvider,  $stateProvider, $urlRouterProvider, $httpProvider){
			
			httpProviderConfig($httpProvider);
			
			locationConfig($locationProvider);
			
			uiRouteConfig(appConstants, $stateProvider, $urlRouterProvider);
			
			materialConfig($mdThemingProvider);
			
		};
		
		/**
		 * Configuration for $httpProvider
		 */
		function httpProviderConfig($httpProvider){
			
			$httpProvider.defaults.withCredentials = true;
			
		}
		
		/**
		 * Configure location provider
		 */
		function locationConfig($locationProvider){
			
			//$locationProvider.html5Mode(true);
			
		};
		
		/**
		 * Angular material UI config
		 */
		function materialConfig($mdThemingProvider){
			
			// Extend the gray theme with a few different shades
			var lightGrey = $mdThemingProvider.extendPalette('grey', {
				'50':  'EFEFEF',
				'200': 'C6C6C6',
				'400': '8C8C8C',
				'800': '323232'
			});

			$mdThemingProvider.theme('default')
				.primaryPalette('indigo')
				.accentPalette('grey');					
			
		};
		
		/**
		 * Angular ui.router config - configure states and partials.
		 */
		function uiRouteConfig(appConstants, $stateProvider, $urlRouterProvider){
			
			$urlRouterProvider.otherwise("/stores");
			
			var defaultStateParams = {
				
				// the current store
				store : null,
				
				// the current directory path resource within the current store
				currDirResource : null
				
				//,
				
				// the relative path to load
				//relPath: null,
				
			};
			
			//
			// store listing state - display a list of stores
			//
			$stateProvider.state(
			
				'stores', {
					url: '/stores',
					views : {
						uicontent : {
							component : 'storeListContentComponent' // when 'stores' state is active, render 'storeListContentComponent' into view with name 'uicontent'
						},
						uiheader : {
							component : 'storeListHeaderComponent' // when 'stores' state is active, render 'storeListHeaderComponent' into view with name 'uiheader'
						},
						uititle : {
							//template : 'Protocol Listing'
							component : 'titleHeaderComponent' // when 'stores' state is active, render 'titleHeaderComponent' into view with name 'uititle'
						},
						uileftmenu : {
							//template : 'Protocol Listing'
							component : 'leftMenuComponent' // when 'stores' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
						}
					},
					params : defaultStateParams,
					resolve : {
						stores : function (homeRestService, $log) {
							
							$log.debug('------------ [stores state] resolving stores ');
							
							return homeRestService
								.storeList()
								.then( function ( jsonData ){
									//$log.debug('resolved prots');
									//$log.debug(JSON.stringify(jsonData));
									return jsonData;
								}, function( error ){
									alert('Error calling storeList() service method' + JSON.stringify(error));
								});
						},
						headerTitle : function ($log, $stateParams){
							
							$log.debug('------------ [stores state] resolving header title ');
							
							//$log.debug(JSON.stringify($stateParams));
							
							return 'Store List';
							
						}
					}					
				}				
				
			);

			//
			// path resource state - display a list of child path resources (directory and file meta) for the currently selected directory path
			//			
			$stateProvider.state(
			
				'path', {
					url: '/path{urlPath:any}',
					views : {
						uicontent : {
							component : 'pathContentComponent' // when 'path' state is active, render 'pathContentComponent' into view with name 'uicontent'
						},
						uiheader : {
							component : 'pathHeaderComponent' // when 'path' state is active, render 'pathHeaderComponent' into view with name 'uiheader'
						},
						uititle : {
							//template : '{{$ctrl.headerTitle}}'
							component : 'titleHeaderComponent' // when 'path' state is active, render 'titleHeaderComponent' into view with name 'uititle'
						},
						uileftmenu : {
							//template : 'Protocol Listing'
							component : 'leftMenuComponent' // when 'prot' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
						}
					},
					params : defaultStateParams,					
					resolve : {
						
						// the current store
						store : function(homeRestService, urlParseService, $log, $state, $stateParams) {
							
							$log.debug('------------ [path state] resolving store ');
							//$log.debug(JSON.stringify($stateParams));
							
							// use existing store if we have one
							if($stateParams.store){
                                
								return $stateParams.store;
							
							// otherwise parse store name from urlPath, then fetch from server
							}else{
								
                                $log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
								$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);

								return homeRestService
									.storeByName(parseData.storeName, parseData.relPath)
									.then( function ( jsonData ){
										$log.debug('resolved store with name ' + parseData.storeName);
										//$log.debug(JSON.stringify(jsonData))
										return jsonData;
									}, function( error ){
										alert('Error calling storeByName(...) service method' + JSON.stringify(error));
									});
								
							}
							
						},
						
						// current directory
						directory : function (homeRestService, urlParseService, $log, $state, $stateParams) {

							$log.debug('------------ [path state] resolving directory resource');
							//$log.debug(JSON.stringify($stateParams));

							var storeName;
							var currDirRes;
							var relPathToLoad;

							// use current store and current directory path resource if we have that information
							if($stateParams.store && $stateParams.currDirResource){
                                
								storeName = $stateParams.store.name;
								currDirRes = $stateParams.currDirResource;
								relPathToLoad = currDirRes.relativePath;								
							
							// otherwise parse store name and relative path from urlPath value
							}else{
                                
								$log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
                                $log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                                
								storeName = parseData.storeName;
								relPathToLoad = parseData.relPath;
  
							}	

							// fetch directory patn resource
							return homeRestService
								.pathResourceByPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved current directory, storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling pathResourceByPath(...) service method' + JSON.stringify(error));
								});							

						},
						
						// the first-level child resources for the current directory
						pathresources : function (homeRestService, urlParseService, $log, $state, $stateParams) {
							
							$log.debug('------------ [path state] resolving path resources');
							//$log.debug(JSON.stringify($stateParams));
							
							var storeName;
							var currDirRes;
							var relPathToLoad;
							
							// use current store and current directory path resource if we have that information
							if($stateParams.store && $stateParams.currDirResource){
                                
								storeName = $stateParams.store.name;
								currDirRes = $stateParams.currDirResource;
								relPathToLoad = currDirRes.relativePath;								
							
							// otherwise parse store name and relative path from urlPath value
							}else{
                                
								$log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
                                $log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                                
								storeName = parseData.storeName;
								relPathToLoad = parseData.relPath;
  
							}
							
							//$log.debug('storeName = ' + storeName);
							//$log.debug('dirNodeId = ' + currDirRes.nodeId);
							
							// fetch child path resources for the current directory
							return homeRestService
								.loadRelPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved path resources for storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
								});
								
						},
						
						// current header title
						headerTitle : function (urlParseService, $log, $stateParams){
							
							$log.debug('------------ [path state] resolving header title');
							//$log.debug(JSON.stringify($stateParams));
							
							var title = 'Documents for ';
							
							if($stateParams.store){
							
								// use current store name in our state params, if we have it
								title = title + $stateParams.store.name;
							
							}else{
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
                                $log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                                
                                title = title + parseData.storeName;
								
							}
							
							return title;
							
						},
						
						// breadcrumb parent tree (bottom-up) for current directory
						breadcrumb : function (homeRestService, urlParseService, $log, $stateParams){
							
							$log.debug('------------ [path state] resolving breadcrumb parent tree');
							
							//$log.debug(JSON.stringify($stateParams));
							
							var storeName;
							var currDirRes;
							var relPathToLoad;
							
							// use current store and current directory path resource if we have that information
							if($stateParams.store && $stateParams.currDirResource){
                                
								storeName = $stateParams.store.name;
								currDirRes = $stateParams.currDirResource;
								relPathToLoad = currDirRes.relativePath;								
							
							// otherwise parse store name and relative path from urlPath value
							}else{

								$log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
                                $log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                                
								storeName = parseData.storeName;
								relPathToLoad = parseData.relPath;
                                
							}						
						
							// return parent-tree breadcrumb
							return homeRestService
								.breadcrumbPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved breadcrumb tree for storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling breadcrumbPath(...) service method' + JSON.stringify(error));
								});
							
						}
					}				
				}			
			
			);
			
			//
			// store listing state - display a list of stores
			//
			$stateProvider.state(
			
				'upload', {
					url: '/upload{urlPath:any}',
					views : {
						uicontent : {
							component : 'uploadContentComponent' // when 'upload' state is active, render 'uploadContentComponent' into view with name 'uicontent'
						},
						uiheader : {
							component : 'uploadHeaderComponent' // when 'upload' state is active, render 'uploadHeaderComponent' into view with name 'uiheader'
						},
						uititle : {
							//template : 'Protocol Listing'
							component : 'titleHeaderComponent' // when 'upload' state is active, render 'titleHeaderComponent' into view with name 'uititle'
						},
						uileftmenu : {
							//template : 'Protocol Listing'
							component : 'leftMenuComponent' // when 'upload' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
						}
					},
					params : defaultStateParams,
					resolve : {
						headerTitle : function ($log, $stateParams){
							
							$log.debug('------------ [upload state] resolving headerTitle');							
							//$log.debug(JSON.stringify($stateParams));							
							
							return 'Upload Form';
							
						},
						
						uploader : function ($log, $stateParams, EAFileUploader, appConstants){
							
							$log.debug('------------ [upload state] resolving eaUploader');	
							
							var eaUploader = new EAFileUploader({
								url: appConstants.httpUploadHandler
					        });
							
							$log.debug(eaUploader.hello());
							
							return eaUploader;
							
						},
						
						// the current store
						store : function(homeRestService, urlParseService, $log, $state, $stateParams) {
							
							$log.debug('------------ [upload state] resolving store');
							//$log.debug(JSON.stringify($stateParams));
							
							// use existing store if we have one
							if($stateParams.store){
                                
								return $stateParams.store;
							
							// otherwise parse store name from urlPath, then fetch from server
							}else{
								
                                $log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
								$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);

								return homeRestService
									.storeByName(parseData.storeName, parseData.relPath)
									.then( function ( jsonData ){
										$log.debug('resolved store with name ' + parseData.storeName);
										//$log.debug(JSON.stringify(jsonData))
										return jsonData;
									}, function( error ){
										alert('Error calling storeByName(...) service method' + JSON.stringify(error));
									});
								
							}
							
						},
						
						// current directory
						directory : function (homeRestService, urlParseService, $log, $state, $stateParams) {

							$log.debug('------------ [upload state] resolving directory resource');
							//$log.debug(JSON.stringify($stateParams));

							var storeName;
							var currDirRes;
							var relPathToLoad;

							// use current store and current directory path resource if we have that information
							if($stateParams.store && $stateParams.currDirResource){
                                
								storeName = $stateParams.store.name;
								currDirRes = $stateParams.currDirResource;
								relPathToLoad = currDirRes.relativePath;								
							
							// otherwise parse store name and relative path from urlPath value
							}else{
                                
								$log.debug('parse store name and relpath from urlPath');
                                
                                var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                                
                                $log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                                
								storeName = parseData.storeName;
								relPathToLoad = parseData.relPath;
  
							}	

							// fetch directory patn resource
							return homeRestService
								.pathResourceByPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved current directory, storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling pathResourceByPath(...) service method' + JSON.stringify(error));
								});							

						}						
						
					}					
				}				
				
			);			
		

		};
		
		// not sure why we call run() on our app. It was in the angular1 'hello galaxy' example
		// https://ui-router.github.io/ng1/tutorial/hellogalaxy
		
		//homeApp.run(function($http, $uiRouter, $log) {
		//	$log.debug('Running prodocui');
			//window['ui-router-visualizer'].visualizer($uiRouter);
			//$http.get('data/people.json', { cache: true });
		//});		
			
})();