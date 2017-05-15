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
			eastoreTestJaxrsService: '@eastore.test.jax.rs.service@',
			eastoreUiJsonJaxrsService: '@eastore.ui.json.jax.rs.service@',
			eastoreUiActionJaxrsService: '@eastore.ui.action.jax.rs.service@',
			httpUploadHandler : '@eastore.ui.action.jax.rs.service@/uploadFile',
			leftNavComponentId : 'MyLeftNav'
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
			var spaceGrey = $mdThemingProvider.extendPalette('grey', {
				'A100': '#f0f0f0', // md-hue-1
				//'A200': '#84ffff',	 // md-hue-1
				'A400': '#b3b3b3', // md-hue-2
				'A700': '#333333', // md-hue-3
			});
			
			$mdThemingProvider.definePalette('spaceGrey', spaceGrey);

			$mdThemingProvider.theme('default')
				.primaryPalette('indigo')
				.accentPalette('spaceGrey');

			//$mdThemingProvider.theme('docs-dark', 'default')
			//	.primaryPalette('pink')
			//	.accentPalette('orange')
			//	.dark();				
			
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
						stores : function ($log, $stateParams, resolveService) {
							
							$log.debug('------------ [stores state] resolving stores ');
							return resolveService.resolveStores($stateParams);
							
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
						//store : function(homeRestService, urlParseService, $log, $state, $stateParams) {
						store : function($log, $stateParams, resolveService) {
							
							$log.debug('------------ [path state] resolving store');
							return resolveService.resolveCurrentStore($stateParams);
							
						},
						
						// current directory
						//directory : function (homeRestService, urlParseService, $log, $state, $stateParams) {
						directory : function ($log, $stateParams, resolveService) {

							$log.debug('------------ [path state] resolving directory resource');
							return resolveService.resolveCurrentDirectory($stateParams);

						},	
						
						// the first-level child resources for the current directory
						//pathresources : function (homeRestService, urlParseService, $log, $state, $stateParams) {
						pathresources : function ($log, $stateParams, resolveService) {
							
							$log.debug('------------ [path state] resolving path resources');
							return resolveService.resolvePathResources($stateParams);
								
						},
						
						// current header title
						headerTitle : function (urlParseService, $log, $stateParams){
							
							$log.debug('------------ [path state] resolving header title');
							
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
						//breadcrumb : function (homeRestService, urlParseService, $log, $stateParams){
						breadcrumb : function ($log, $stateParams, resolveService){
							
							$log.debug('------------ [path state] resolving breadcrumb parent tree');
							return resolveService.resolveBreadcrumb($stateParams);
							
						}
					}				
				}			
			
			);
			
			//
			// upload state - display upload form
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
							return 'Upload Form';
							
						},
						
						uploader : function ($log, $stateParams, resolveService){
							
							$log.debug('------------ [upload state] resolving eaUploader');	
							return resolveService.resolveEAUploader();
							
						},
						
						// the current store
						//store : function(homeRestService, urlParseService, $log, $state, $stateParams) {
						store : function($log, $stateParams, resolveService) {
							
							$log.debug('------------ [upload state] resolving store');
							return resolveService.resolveCurrentStore($stateParams);
							
						},
						
						// current directory
						//directory : function (homeRestService, urlParseService, $log, $state, $stateParams) {
						directory : function ($log, $stateParams, resolveService) {

							$log.debug('------------ [upload state] resolving directory resource');
							return resolveService.resolveCurrentDirectory($stateParams);

						}						
						
					}					
				}				
				
			);

			//
			// create directory state - show create directory form
			//
			$stateProvider.state(
			
				'createdir', {
					url: '/createdir{urlPath:any}',
					views : {
						uicontent : {
							component : 'createDirContentComponent' // when 'createdir' state is active, render 'uploadContentComponent' into view with name 'uicontent'
						},
						uiheader : {
							component : 'createDirHeaderComponent' // when 'createdir' state is active, render 'uploadHeaderComponent' into view with name 'uiheader'
						},
						uititle : {
							//template : 'Protocol Listing'
							component : 'titleHeaderComponent' // when 'createdir' state is active, render 'titleHeaderComponent' into view with name 'uititle'
						},
						uileftmenu : {
							//template : 'Protocol Listing'
							component : 'leftMenuComponent' // when 'createdir' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
						}
					},
					params : defaultStateParams,
					resolve : {
						headerTitle : function ($log, $stateParams){
							
							$log.debug('------------ [createdir state] resolving headerTitle');							
							//$log.debug(JSON.stringify($stateParams));							
							
							return 'Create Directory Form';
							
						},
						
						// the current store
						//store : function(homeRestService, urlParseService, $log, $state, $stateParams) {
						store : function($log, $stateParams, resolveService) {
							
							$log.debug('------------ [createdir state] resolving store');

							return resolveService.resolveCurrentStore($stateParams);
							
						},
						
						// current directory
						//directory : function (homeRestService, urlParseService, $log, $state, $stateParams) {
						directory : function ($log, $stateParams, resolveService) {

							$log.debug('------------ [createdir state] resolving directory resource');
							
							return resolveService.resolveCurrentDirectory($stateParams);

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