(function(){
	
	'use strict';
	
	var homeApp;
	
	/**
	 * Initialize application.
	 * 
	 * ECOG-ACRIN Modules:
	 * 
	 * prodoc-main - Our main module
	 * prodoc-util - Utility module
	 * 
	 * Third Party Modules:
	 * 
	 * ui.router - Routing frameworks, essentially more powerful version of built in ngRoute.
	 * ngMaterial - Material design UI components
	 * ngResource - Provides interaction support with RESTful services via the $resource service
	 * smart-table - lightweight table module
	 * 
	 */
	homeApp = angular
		.module('prodoc-home-app',
				[
				 'ui.router', 'ngMaterial', 'ngResource', 'prodoc-main', 'prodoc-util', 'smart-table'
				 ])
		// @xyz@ values are replaced/filtered by maven during build process
		.constant('appConstants', {
			contextPath: '@application.context@',
			applicationUrl: '@application.url@',
			eaStoreName: '@ea.store.name@',
			eastoreuiJaxrsService: '@eastoreui.jax.rs.service@'
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
							
							//$log.debug('resolving header title');
							
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
						store : function(homeRestService, $log, $state, $stateParams) {
							
							$log.debug('------------ resolving store ');
							$log.debug(JSON.stringify($stateParams));
							
							// use existing store if we have one
							if($stateParams.store){
								return $stateParams.store;
							
							// otherwise parse store name from urlPath, then fetch from server
							}else{
								$log.debug('parse store name and relpath from urlPath');
								var urlPath = $stateParams.urlPath;
								if(urlPath.startsWith('/')){
									urlPath = urlPath.slice(1); // remove '/' from front
								}
								var slashIndex = urlPath.indexOf('/');
								var storeName = urlPath.substring(0, slashIndex);
								var relPathToLoad = urlPath.substring(slashIndex);
								$log.debug('storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);

								return homeRestService
									.storeByName(storeName, relPathToLoad)
									.then( function ( jsonData ){
										$log.debug('resolved store with name ' + storeName);
										//$log.debug(JSON.stringify(jsonData))
										return jsonData;
									}, function( error ){
										alert('Error calling storeByName(...) service method' + JSON.stringify(error));
									});
								
							}
							
						},
						pathresources : function (homeRestService, $log, $state, $stateParams) {
							
							$log.debug('------------ resolving path resources');
							$log.debug(JSON.stringify($stateParams));
							
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
								var urlPath = $stateParams.urlPath;
								if(urlPath.startsWith('/')){
									urlPath = urlPath.slice(1); // remove '/' from front
								}
								var slashIndex = urlPath.indexOf('/');
								storeName = urlPath.substring(0, slashIndex);
								relPathToLoad = urlPath.substring(slashIndex);
								$log.debug('storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
							}
							
							//$log.debug('storeName = ' + storeName);
							//$log.debug('dirNodeId = ' + currDirRes.nodeId);
							
							// fetch child path resources for the current directory
							return homeRestService
								.loadRelPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved path resources for relPath ' + relPathToLoad);
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
								});
								
						},
						headerTitle : function ($log, $stateParams){
							
							$log.debug('------------  resolving header title');
							$log.debug(JSON.stringify($stateParams));
							
							var title = 'Documents for ';
							
							if($stateParams.store){
							
								// use current store name in our state params, if we have it
								title = title + $stateParams.store.name;
							
							}else{
								
								// parse the store name value from the relPath
								var urlPath = $stateParams.urlPath;
								if(urlPath.startsWith('/')){
									urlPath = urlPath.slice(1); // remove '/' from front
								}
								var slashIndex = urlPath.indexOf('/');
								var storeName = urlPath.substring(0, slashIndex);
								var relPathToLoad = urlPath.substring(slashIndex);	
								title = title + storeName;
								
							}
							
							return title;
							
						},
						breadcrumb : function (homeRestService, $log, $stateParams){
							
							//$log.debug('resolving breadcrumb tree');							
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
								var urlPath = $stateParams.urlPath;
								if(urlPath.startsWith('/')){
									urlPath = urlPath.slice(1); // remove '/' from front
								}
								var slashIndex = urlPath.indexOf('/');
								storeName = urlPath.substring(0, slashIndex);
								relPathToLoad = urlPath.substring(slashIndex);
								$log.debug('storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
							}						
						
							// return parent-tree breadcrumb
							return homeRestService
								.breadcrumbPath(storeName, relPathToLoad)
								.then( function ( jsonData ){
									$log.debug('resolved breadcrumb tree');
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling breadcrumbPath(...) service method' + JSON.stringify(error));
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