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
			
			// store for edit (probably could have used 'store' attribute)
			editStore : null,
			
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
						
					}
					
					//,

					// resolve EAStomp websocket client
					/*
					eastomp : function ($log, $state, $stateParams, resolveService){
						
						$log.debug('------------ [root state] resolving EAStomp websocket client');
						return resolveService.resolveStompSocketClient($state, $stateParams);							
						
					}
					*/
					
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
					store : function($log, $stateParams, resolveService, sharedDataService) {
						
						$log.debug('------------ [path state] resolving store');
						
						return resolveService.resolveCurrentStore($stateParams);
						
						//var store = resolveService.resolveCurrentStore($stateParams);
						//sharedDataService.setStore(store);
						//return sharedDataService.getStore();
						
                        //resolveService.resolveCurrentStore($stateParams).then(function (data){
                        //    sharedDataService.setStore(data);
                        //    return sharedDataService.getStore();
                        //});						
						
					},
					
					// current working directory
					directory : function ($log, $stateParams, resolveService, sharedDataService) {

						$log.debug('------------ [path state] resolving directory resource');
						
						return resolveService.resolveCurrentDirectory($stateParams);
						
						//var directory = resolveService.resolveCurrentDirectory($stateParams);
						//sharedDataService.setDirectory(directory);
						//return sharedDataService.getDirectory();
						
                        //var directory = resolveService.resolveCurrentDirectory($stateParams).then(function (data){
                        //    sharedDataService.setDirectory(data);
                        //    return sharedDataService.getDirectory();
                        //});						

					},	
					
					// the first-level child resources for the current directory
					/* // no longer resolved. we now load the pathresources using our shared data service. See controller for pathContentComponent.
					pathresources : function ($log, $stateParams, resolveService, sharedDataService) {
						
						$log.debug('------------ [path state] resolving path resources');
						
						return resolveService.resolvePathResources($stateParams);
						
						//var pathResources = resolveService.resolvePathResources($stateParams);
						//sharedDataService.setPathResources(pathResources);
						//return sharedDataService.getPathResources();
							
					},
					*/
					
					// current header title
					headerTitle : function (urlParseService, $log, $stateParams){
						
						$log.debug('------------ [path state] resolving header title');
						
						var title = 'Documents for ';
						
						if($stateParams.store){
						
							// use current store name in our state params, if we have it
							title = title + $stateParams.store.name;
						
						}else{
                            
                            var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
                            
                            //$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
                            
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
					
					// current working directory
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
					
					// current working directory
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
					
					// inject directoryToEdit so its resolved before we fetch the categories for it's read, write, and execute groups
					editDirModel : function ($log, $stateParams, resolveService, directoryToEdit) {
						
						$log.debug('------------ [editdir state] resolving edit dir model for display');

						var editDirModel = {
							
							dirId : directoryToEdit.nodeId,
							dirName : directoryToEdit.nodeName,
							dirDescription: directoryToEdit.desc,
							
							readCat1: '',
							readGroup1: '',
							
							writeCat1: '',
							writeGroup1: '',
							
							executeCat1: '',
							executeGroup1: '',

							groupsForReadCat1: [],
							groupsForWriteCat1: [],
							groupsForExecuteCat1: []
							
						}

						// get read group, category for read group, and all groups for the category
						if(directoryToEdit.readGroup1){
							
							resolveService.resolveGatekeeperGroupByGroupCode(directoryToEdit.readGroup1).then(function (data){
								editDirModel.readGroup1 = data;
							});							
							resolveService.resolveGatekeeperCategoryByGroupCode(directoryToEdit.readGroup1).then(function (data){
								editDirModel.readCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editDirModel.readCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editDirModel.readCat1.categoryCode).then(function (data){
									editDirModel.groupsForReadCat1 = data;
								});								
								
							});							
						}
						
						// get write group, category for write group, and all groups for the category
						if(directoryToEdit.writeGroup1){
							
							resolveService.resolveGatekeeperGroupByGroupCode(directoryToEdit.writeGroup1).then(function (data){
								editDirModel.writeGroup1 = data;
							});							
							resolveService.resolveGatekeeperCategoryByGroupCode(directoryToEdit.writeGroup1).then(function (data){
								editDirModel.writeCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editDirModel.writeCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editDirModel.writeCat1.categoryCode).then(function (data){
									editDirModel.groupsForWriteCat1 = data;
								});								
								
							});							
						}
						
						// get execute group, category for execute group, and all groups for the category
						if(directoryToEdit.executeGroup1){
							resolveService.resolveGatekeeperGroupByGroupCode(directoryToEdit.executeGroup1).then(function (data){
								editDirModel.executeGroup1 = data;
							});								
							resolveService.resolveGatekeeperCategoryByGroupCode(directoryToEdit.executeGroup1).then(function (data){
								editDirModel.executeCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editDirModel.executeCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editDirModel.executeCat1.categoryCode).then(function (data){
									editDirModel.groupsForExecuteCat1 = data;
								});								
								
							});							
						}

						return editDirModel;
						
					}
					
				}					
			}				
			
		);
		
		//
		// edit file state - show create directory form
		//
		$stateProvider.state(
		
			'editfile', {
				parent: 'root',
				url: '/editfile{urlPath:any}',
				views : {
					uicontent : {
						component : 'editFileContentComponent' // when 'editfile' state is active, render 'editFileContentComponent' into view with name 'uicontent'
					},
					uiheader : {
						component : 'editFileHeaderComponent' // when 'editfile' state is active, render 'editFileHeaderComponent' into view with name 'uiheader'
					},
					uititle : {
						//template : 'Protocol Listing'
						component : 'titleHeaderComponent' // when 'editfile' state is active, render 'titleHeaderComponent' into view with name 'uititle'
					},
					uileftmenu : {
						//template : 'Protocol Listing'
						component : 'leftMenuComponent' // when 'editfile' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
					}
				},
				params : defaultStateParams,
				resolve : {
					headerTitle : function ($log, $stateParams){
						
						$log.debug('------------ [editfile state] resolving headerTitle');							
						//$log.debug(JSON.stringify($stateParams));						
						
						return 'Edit File Form';
						
					},
					
					// the current store
					store : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [editfile state] resolving store');

						return resolveService.resolveCurrentStore($stateParams);
						
					},
					
					// current working directory
					directory : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [editfile state] resolving directory resource');
						
						return resolveService.resolveCurrentDirectory($stateParams);

					},
					
					// file the user wants to edit
					fileToEdit : function ($log, $stateParams, resolveService) {

						$log.debug('------------ [editfile state] resolving file to edit');
						
						//$log.debug(JSON.stringify($stateParams));							
						
						return resolveService.resolveCurrentEditResource($stateParams);

					},

					// inject fileToEdit so its resolved before we fetch any other potential file data we need for the edit file form
					editFileModel : function ($log, $stateParams, resolveService, fileToEdit) {

						$log.debug('------------ [editdir state] resolving edit file model for display');
					
						var editFileModel = {
							
							fileId : fileToEdit.nodeId,
							fileName : fileToEdit.nodeName,
							fileDescription: fileToEdit.desc
							
						}
						
						return editFileModel;

					}					
					
				}					
			}				
			
		);

		//
		// edit store state - show edit store form
		//
		$stateProvider.state(
		
			'editstore', {
				parent: 'root',
				url: '/editstore{urlPath:any}', // don't really need the 'urlPath:any' part. Remove and test later.
				views : {
					uicontent : {
						component : 'editStoreContentComponent' // when 'editstore' state is active, render 'editStoreContentComponent' into view with name 'uicontent'
					},
					uiheader : {
						component : 'editStoreHeaderComponent' // when 'editstore' state is active, render 'editStoreHeaderComponent' into view with name 'uiheader'
					},
					uititle : {
						//template : 'Protocol Listing'
						component : 'titleHeaderComponent' // when 'editstore' state is active, render 'titleHeaderComponent' into view with name 'uititle'
					},
					uileftmenu : {
						//template : 'Protocol Listing'
						component : 'leftMenuComponent' // when 'editstore' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
					}
				},
				params : defaultStateParams,
				resolve : {
					headerTitle : function ($log, $stateParams){
						
						$log.debug('------------ [editstore state] resolving headerTitle');					
						
						return 'Edit Store Form';
						
					},
					
					// the store the user is editing
					storeToEdit : function($log, $stateParams, resolveService) {
						
						$log.debug('------------ [editstore state] resolving store to edit');
					
						return resolveService.resolveEditStore($stateParams);
					
					},						
					
					gatekeeperCategories : function ($log, $stateParams, resolveService) {
						
						$log.debug('------------ [editstore state] resolving gatekeeper categories');
						
						return resolveService.resolveGatekeeperCategories();
						
					},
					
					editStoreModel : function ($log, $stateParams, resolveService, storeToEdit) {
						
						$log.debug('------------ [editstore state] resolving edit store model for display');

						var editStoreModel = {
								
							storeId: storeToEdit.id,
							storeName: storeToEdit.name,
							storeDesc: storeToEdit.description,
							storePath: storeToEdit.path,
							
							rootDir : {
								
								dirId : storeToEdit.rootDir.nodeId,
								dirName : storeToEdit.rootDir.nodeName,
								dirDescription: storeToEdit.rootDir.desc,
								
								readCat1: '',
								readGroup1: '',
								
								writeCat1: '',
								writeGroup1: '',
								
								executeCat1: '',
								executeGroup1: '',

								groupsForReadCat1: [],
								groupsForWriteCat1: [],
								groupsForExecuteCat1: []							
								
							}
							
						}

						// get read group, category for read group, and all groups for the category
						if(storeToEdit.rootDir.readGroup1){
							
							resolveService.resolveGatekeeperGroupByGroupCode(storeToEdit.rootDir.readGroup1).then(function (data){
								editStoreModel.rootDir.readGroup1 = data;
							});							
							resolveService.resolveGatekeeperCategoryByGroupCode(storeToEdit.rootDir.readGroup1).then(function (data){
								editStoreModel.rootDir.readCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editStoreModel.rootDir.readCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editStoreModel.rootDir.readCat1.categoryCode).then(function (data){
									editStoreModel.rootDir.groupsForReadCat1 = data;
								});								
								
							});							
						}
						
						// get write group, category for write group, and all groups for the category
						if(storeToEdit.rootDir.writeGroup1){
							
							resolveService.resolveGatekeeperGroupByGroupCode(storeToEdit.rootDir.writeGroup1).then(function (data){
								editStoreModel.rootDir.writeGroup1 = data;
							});							
							resolveService.resolveGatekeeperCategoryByGroupCode(storeToEdit.rootDir.writeGroup1).then(function (data){
								editStoreModel.rootDir.writeCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editStoreModel.rootDir.writeCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editStoreModel.rootDir.writeCat1.categoryCode).then(function (data){
									editStoreModel.rootDir.groupsForWriteCat1 = data;
								});								
								
							});							
						}
						
						// get execute group, category for execute group, and all groups for the category
						if(storeToEdit.rootDir.executeGroup1){
							resolveService.resolveGatekeeperGroupByGroupCode(storeToEdit.rootDir.executeGroup1).then(function (data){
								editStoreModel.rootDir.executeGroup1 = data;
							});								
							resolveService.resolveGatekeeperCategoryByGroupCode(storeToEdit.rootDir.executeGroup1).then(function (data){
								editStoreModel.rootDir.executeCat1 = data;
							}).then(function(){
								// run in another 'then' block because we have to wait for value 'editStoreModel.rootDir.executeCat1' to resolve
								resolveService.resolveGatekeeperGroupsForCategory(editStoreModel.rootDir.executeCat1.categoryCode).then(function (data){
									editStoreModel.rootDir.groupsForExecuteCat1 = data;
								});								
								
							});							
						}

						return editStoreModel;
						
					}
					
				}					
			}				
			
		);		
	

	};
	
	homeApp.run(['$log', '$transitions', '$trace', function($log, $transitions, $trace) {
		
		$log.debug('Running eastore-ui');
		
		//$trace.enable('TRANSITION');
		
		$transitions.onStart({ }, function(trans) {
			
			$log.debug('Transition started [from = ' + trans.from().name + ', to = ' + trans.to().name + ']');
			//$log.debug(JSON.stringify($stateParams));
			
		});
		
		// $transitions.onExit
		// $transitions.onRetain
		// $transitions.onEnter // runs after onRetain
		// $transitions.onFinish
		// $transitions.onSuccess
		// $transitions.onError
		
	}])	
	
	/*
	homeApp.run(['$log', '$rootScope', function($log, $rootScope) {
		
		$log.debug('Running eastore-ui');
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			$log.debug('state change start: toState = ' + toState + ', fromState = ' + fromState)
		});		
		
	}]);
	*/
	
	// not sure why we call run() on our app. It was in the angular1 'hello galaxy' example
	// https://ui-router.github.io/ng1/tutorial/hellogalaxy
	
	//homeApp.run(function($http, $uiRouter, $log) {
	//	$log.debug('Running prodocui');
		//window['ui-router-visualizer'].visualizer($uiRouter);
		//$http.get('data/people.json', { cache: true });
	//});		
		
})();