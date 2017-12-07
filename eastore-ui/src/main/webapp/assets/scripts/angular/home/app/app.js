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
	 * ea-stomp-module ---- STOMP messaging over web sockets using SockJS
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
				 'ui.router', 'ngMaterial', 'ngResource', 'eastore-ui-main', 'eastore-ui-util', 'ea-upload-module', 'ea-stomp-module', 'smart-table'
				 ])
		// @xyz@ values are replaced/filtered by maven during build process
		.constant('appConstants', {
			contextPath: '@application.context@',
			applicationUrl: '@application.url@',
			eastoreTestJaxrsService: '@eastore.test.jax.rs.service@',
			eastoreUiJsonJaxrsService: '@eastore.ui.json.jax.rs.service@',
			eastoreUiActionJaxrsService: '@eastore.ui.action.jax.rs.service@',
			httpUploadHandler : '@eastore.ui.action.jax.rs.service@/uploadFile',
			eastoreStompSockJsUrl : '@eastore.websocket.stomp.sockjs@',
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
		//$urlRouterProvider.otherwise("/root");
		
		var defaultStateParams = {
			
			// the current working store
			store : null,
			
			// the current working directory path resource within the current working store
			currDirResource : null,
			
			// the current child resource user wants to edit
			currEditResource : null
			
			// the relative path to load
			//relPath: null,
			
		};
		
		//
		// root state - the parent state of all our other states. here we can resolve common data for all our states
		//
		$stateProvider.state(
			'root', {
				
				abstract: true,
				
				//url: '/root',
				//template :
				//	'fu<div ui-view>hello!</div>bar',
				
				// this worked, but decided to change it to route to a component.
				//views : {
				//	'rootview' : {
				//		templateUrl : appConstants.contextPath + '/assets/scripts/angular/home/modules/home/views/root.jsp'
				//	}
				//	
				//},
				
				views : {
					'rootview' : {
						component : 'rootComponent'
					}
					
				},					

				resolve : {
					
					something: function($log){
						$log.debug('------------ [root state] resolving something.');
					},
					
					leftnavid : function($log, appConstants){
						
						$log.debug('------------ [root state] resolving left nav id');
						return appConstants.leftNavComponentId;
						
					},

					// resolve EAStomp websocket client
					eastomp : function ($log, $state, $stateParams, resolveService){
						
						$log.debug('------------ [root state] resolving EAStomp websocket client');
						return resolveService.resolveStompSocketClient($state, $stateParams);							
						
					}
					
				}
				
			}
		);
		
		//
		// store listing state - display a list of stores
		//
		$stateProvider.state(
		
			'stores', {
				parent: 'root',
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
		// store listing state - display a list of stores
		//
		$stateProvider.state(
		
			'createstore', {
				parent: 'root',
				url: '/createstore',
				views : {
					uicontent : {
						component : 'createStoreContentComponent' // when 'createstore' state is active, render 'createStoreContentComponent' into view with name 'uicontent'
					},
					uiheader : {
						component : 'createStoreHeaderComponent' // when 'createstore' state is active, render 'createStoreHeaderComponent' into view with name 'uiheader'
					},
					uititle : {
						component : 'titleHeaderComponent' // when 'createstore' state is active, render 'titleHeaderComponent' into view with name 'uititle'
					},
					uileftmenu : {
						component : 'leftMenuComponent' // when 'createstore' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
					}
				},
				params : defaultStateParams,
				resolve : {
					
					headerTitle : function ($log, $stateParams){
						
						$log.debug('------------ [create store state] resolving header title ');
						return 'Store List';
						
					},
					
					gatekeeperCategories : function ($log, $stateParams, resolveService) {
						
						$log.debug('------------ [create store state] resolving gatekeeper categories');
						
						return resolveService.resolveGatekeeperCategories();
						
					}
					
					// if one resolve depends on another, inject the first resolve into
					// the second resolved statement. The first one will resolve first so
					// that you have it when you resolve the second dependency
					//
					// https://stackoverflow.com/questions/43347819/ui-router-resolve-depends-on-other-resolve						
					
				}					
			}				
			
		);			

		//
		// path resource state - display a list of child path resources (directory and file meta) for the currently selected directory path
		//			
		$stateProvider.state(
		
			'path', {
				parent: 'root',
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
					store : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [path state] resolving store');
						return resolveService.resolveCurrentStore($stateParams);
						
					},
					
					// current directory
					directory : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [path state] resolving directory resource');
						return resolveService.resolveCurrentDirectory($stateParams);

					},	
					
					// the first-level child resources for the current directory
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
				parent: 'root',
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
					store : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [upload state] resolving store');
						return resolveService.resolveCurrentStore($stateParams);
						
					},
					
					// current directory
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
				parent: 'root',
				url: '/createdir{urlPath:any}',
				views : {
					uicontent : {
						component : 'createDirContentComponent' // when 'createdir' state is active, render 'createDirContentComponent' into view with name 'uicontent'
					},
					uiheader : {
						component : 'createDirHeaderComponent' // when 'createdir' state is active, render 'createDirHeaderComponent' into view with name 'uiheader'
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
					store : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [createdir state] resolving store');

						return resolveService.resolveCurrentStore($stateParams);
						
					},
					
					// current directory
					directory : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [createdir state] resolving directory resource');
						
						return resolveService.resolveCurrentDirectory($stateParams);

					},
					
					gatekeeperCategories : function ($log, $stateParams, resolveService) {
						
						$log.debug('------------ [createdir state] resolving gatekeeper categories');
						
						return resolveService.resolveGatekeeperCategories();
						
					}
					
					// if one resolve depends on another, inject the first resolve into
					// the second resolved statement. The first one will resolve first so
					// that you have it when you resolve the second dependency
					//
					// https://stackoverflow.com/questions/43347819/ui-router-resolve-depends-on-other-resolve
					
				}					
			}				
			
		);

		//
		// edit directory state - show edit directory form
		//
		$stateProvider.state(
		
			'editdir', {
				parent: 'root',
				url: '/editdir{urlPath:any}',
				views : {
					uicontent : {
						component : 'editDirContentComponent' // when 'editdir' state is active, render 'editDirContentComponent' into view with name 'uicontent'
					},
					uiheader : {
						component : 'editDirHeaderComponent' // when 'editdir' state is active, render 'editDirHeaderComponent' into view with name 'uiheader'
					},
					uititle : {
						//template : 'Protocol Listing'
						component : 'titleHeaderComponent' // when 'editdir' state is active, render 'titleHeaderComponent' into view with name 'uititle'
					},
					uileftmenu : {
						//template : 'Protocol Listing'
						component : 'leftMenuComponent' // when 'editdir' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
					}
				},
				params : defaultStateParams,
				resolve : {
					headerTitle : function ($log, $stateParams){
						
						$log.debug('------------ [editdir state] resolving headerTitle');							
						//$log.debug(JSON.stringify($stateParams));							
						
						return 'Edit Directory Form';
						
					},
					
					// the current store
					store : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [editdir state] resolving store');

						return resolveService.resolveCurrentStore($stateParams);
						
					},
					
					// current working directory
					directory : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [editdir state] resolving current working directory resource');
						
						return resolveService.resolveCurrentDirectory($stateParams);

					},
					
					// directory the user wants to edit
					directoryToEdit : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [editdir state] resolving directory to edit');
						
						//$log.debug(JSON.stringify($stateParams));							
						
						return resolveService.resolveCurrentEditResource($stateParams);

					},						
					
					gatekeeperCategories : function ($log, $stateParams, resolveService) {
						
						$log.debug('------------ [editdir state] resolving gatekeeper categories');
						
						return resolveService.resolveGatekeeperCategories();
						
					},
					
					// if one resolve depends on another, inject the first resolve into
					// the second resolved statement. The first one will resolve first so
					// that you have it when you resolve the second dependency
					//
					// https://stackoverflow.com/questions/43347819/ui-router-resolve-depends-on-other-resolve
					
					// inject directory so its resolved before we get all the groups
					currentGatekeeperCategories : function ($log, $stateParams, resolveService, directory) {
						
						$log.debug('------------ [editdir state] resolving gatekeeper groups for current directory');
						
						// fetch the categories for the current read, write, and execute groups
				
						var currentCats = {
							read1Cat : {},
							write1Cat : {},
							execute1Cat : {}
						}
						
						// get category for read group
						if(directory.readGroup1){
							currentCats.read1Cat = resolveService.resolveGatekeeperCategoryByGroupCode(directory.readGroup1);
						}
						// get category for write group
						if(directory.writeGroup1){
							currentCats.write1Cat = resolveService.resolveGatekeeperCategoryByGroupCode(directory.writeGroup1);
						}
						// get category for execute group
						if(directory.executeGroup1){
							currentCats.execute1Cat = resolveService.resolveGatekeeperCategoryByGroupCode(directory.executeGroup1);
						}
						
						$log.debug(JSON.stringify(currentCats));
						
						return currentCats;
						
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