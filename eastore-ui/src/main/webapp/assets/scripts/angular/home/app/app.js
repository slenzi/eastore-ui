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
			
			$urlRouterProvider.otherwise("/prot");
			
			/* this works when you don't have a name on <ui-view></ui-view>
			var states = [
				{
					name : 'prot',
					url : '/prot',
					component : 'protComponent',
					resolve : {
						// fetch protocol list
						prots : function (homeRestService, $log) {
							$log.debug('resolving prots');
							return homeRestService
								.protList()
								.then( function ( jsonData ){
									$log.debug(JSON.stringify(jsonData));
									return jsonData;
								}, function( error ){
									alert('Error calling prots() service method' + JSON.stringify(error));
								});
						}
					}
				}
			]
			
			// Loop over the state definitions and register them
			states.forEach(function(state) {
				$stateProvider.state(state);
			});						
						
			*/
			
			//
			// protocol listing state - display a list of protocols that have documents
			//
			$stateProvider.state(
			
				'prot', {
					url: '/prot',
					views : {
						uicontent : {
							component : 'protContentComponent' // when 'prot' state is active, render 'protContentComponent' into view with name 'uicontent'
						},
						uiheader : {
							component : 'protHeaderComponent' // when 'prot' state is active, render 'protHeaderComponent' into view with name 'uiheader'
						},
						uititle : {
							//template : 'Protocol Listing'
							component : 'titleHeaderComponent' // when 'prot' state is active, render 'titleHeaderComponent' into view with name 'uititle'
						},
						uileftmenu : {
							//template : 'Protocol Listing'
							component : 'leftMenuComponent' // when 'prot' state is active, render 'leftMenuComponent' into view with name 'uileftmenu'
						}
					},
					params : {
						prot : null
					},
					resolve : {
						prots : function (homeRestService, $log) {
							return homeRestService
								.protList()
								.then( function ( jsonData ){
									//$log.debug('resolved prots');
									//$log.debug(JSON.stringify(jsonData));
									return jsonData;
								}, function( error ){
									alert('Error calling prots() service method' + JSON.stringify(error));
								});
						},
						headerTitle : function ($log, $stateParams){
							
							//$log.debug('resolving header title');
							
							//$log.debug(JSON.stringify($stateParams));
							
							return 'Protocol List';
							
						}
					}					
				}				
				
			);

			//
			// path resource state - display a list of child path resources (directory and file meta) for the currently selected directory path
			//			
			$stateProvider.state(
			
				'path', {
					url: '/path{relPath:any}',
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
					params : {
						prot : null
					},					
					resolve : {
						pathresources : function (homeRestService, $log, $state, $stateParams) {
							
							//$log.debug('resolving path resources');
							
							//$log.debug(JSON.stringify($stateParams));
							
							var relPathToLoad = '/docs' + $stateParams.relPath;
							
							return homeRestService
								.loadRelPath(relPathToLoad)
								.then( function ( jsonData ){
									//$log.debug('resolved path resources');
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
								});
								
						},
						headerTitle : function ($log, $stateParams){
							
							//$log.debug('resolving header title');
							
							//$log.debug(JSON.stringify($stateParams));
							
							var title = 'Documents for ';
							
							if($stateParams.prot){
							
								// use current prot id in our state params, if we have it
								title = title + $stateParams.prot;
							
							}else{
								
								// parse the prot value from the relPath
								var relPath = $stateParams.relPath;
								if(relPath.startsWith('/')){
									relPath = relPath.slice(1); // remove '/' from front
								}
								if(relPath.indexOf('/') === -1){
									// relPath should simply be the prot ID
									title = title + relPath;
								}else{
									var pathElements = relPath.split('/');
									// prot id should be the first value in the relPath
									title = title + pathElements[0];
								}
								
							}
							
							return title;
							
						},
						breadcrumb : function (homeRestService, $log, $stateParams){
							
							$log.debug('resolving breadcrumb tree');
							
							$log.debug(JSON.stringify($stateParams));
							
							var crumbRelPath = '/docs' + $stateParams.relPath;
							
							$log.debug('Crumb relPath = ' + crumbRelPath);
							
							return homeRestService
								.breadcrumbPath(crumbRelPath)
								.then( function ( jsonData ){
									$log.debug('resolved breadcrumb tree');
									//$log.debug(JSON.stringify(jsonData))
									return jsonData;
								}, function( error ){
									alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
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