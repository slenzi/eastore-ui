
(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
		.service('homeRestService', [
			'appConstants', 'Base64', '$log', '$q', '$location', '$http', '$resource', HomeRestService
			]
		);
		
	mainModule
		.service('urlParseService', [
			'appConstants', UrlParseService
			]
		);

	mainModule
		.service('resolveService', [
			'$log', 'appConstants', 'urlParseService', 'homeRestService', 'EAFileUploader', ResolveService
			]
		);		
	
	/**
	 * RESTful services provider
	 */
	function HomeRestService(appConstants, Base64, $log, $q, $location, $http, $resource){

		var eastoreTestService = $resource(
				appConstants.eastoreTestJaxrsService, { }, {
					
					// call echo service which relays to eastore echo service
					echo: {
						url: appConstants.eastoreTestJaxrsService + '/echo',
						method: 'GET',
						isArray: false,
						params: {
							message : '@message'
						}					
					}
				
				});
		
		var eastoreUiActionService = $resource(
				appConstants.eastoreUiActionJaxrsService, { }, {
					
					// call add directory service method
					addDir: {
						url: appConstants.eastoreUiActionJaxrsService + '/addDirectory',
						method: 'GET',
						isArray: false,
						params: {
							dirNodeId : '@dirNodeId',
							name : '@name',
							desc : '@desc'
						}					
					}
				
				});		
		
		var eastoreUiJsonService = $resource(
			appConstants.eastoreUiJsonJaxrsService, { }, {
				
				// fetch a path resource by its node id
				pathResourceByNodeId: {
					url: appConstants.eastoreUiJsonJaxrsService + '/pathresource/node',
					method: 'GET',
					isArray: false,
					params: {
						nodeId : '@nodeId'
					}	
				},
				
				// fetch a path resource by store name and relative path
				pathResourceByPath: {
					url: appConstants.eastoreUiJsonJaxrsService + '/pathresource/path',
					method: 'GET',
					isArray: false,
					params: {
						storeName: '@storeName',
						relPath : '@relPath'
					}		
				},				
				
				// fetch list of all stores
				storeByName: {
					url: appConstants.eastoreUiJsonJaxrsService + '/store/name',
					method: 'GET',
					isArray: false,
					params: {
						storeName : '@storeName'
					}					
				},				
				
				// fetch list of all stores
				storelist: {
					url: appConstants.eastoreUiJsonJaxrsService + '/stores',
					method: 'GET',
					isArray: true,
					params: {}					
				},
				
				// fetch list of first-level child resource under the resource with the relPath
				loadRelPath: {
					url: appConstants.eastoreUiJsonJaxrsService + '/loadRelPath',
					method: 'GET',
					isArray: true,
					params: {
						storeName: '@storeName',
						relPath : '@relPath'
					}	
				},
				
				// fetch breadcrumb tree for some path resource by node id
				breadcrumbNode: {
					url: appConstants.eastoreUiJsonJaxrsService + '/breadcrumb/node',
					method: 'GET',
					isArray: true,
					params: {
						nodeId : '@nodeId'
					}	
				},
				
				// fetch breadcrumb tree for some path resource by relPath
				breadcrumbPath: {
					url: appConstants.eastoreUiJsonJaxrsService + '/breadcrumb/path',
					method: 'GET',
					isArray: true,
					params: {
						storeName: '@storeName',
						relPath : '@relPath'
					}	
				}				
			
			});
		
		
		// *********************************
		// Internal RESTful methods
		// *********************************
				
		function _echo(msg){
			
			$log.debug('Calling jax-rs test echo service method');
			
			return eastoreTestService.echo({ message : msg }).$promise;		
			
		}
		
		// add a new directory
		function _addDirectory(parentDirId, dirName, dirDesc){
			
			$log.debug('Calling jax-rs _addDirectory service method');
			
			return eastoreUiActionService.addDir(
					{
						dirNodeId : parentDirId,
						name : dirName,
						desc : dirDesc
					}).$promise;
			
		}
		
		// fetch a specific path resource by node id.
		function _pathResourceByNodeId(theNodeId){
			
			$log.debug('Calling jax-rs _pathResourceByNodeId service method');
			
			return eastoreUiJsonService.pathResourceByNodeId({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch a specific path resource by store name and relative path
		function _pathResourceByPath(storeName, relativePath){
			
			$log.debug('Calling jax-rs _pathResourceByPath service method');
			
			return eastoreUiJsonService.pathResourceByPath({ storeName : storeName, relPath : relativePath }).$promise;					
			
		}		
		
		// fetch parent tree path for some child resource
		function _breadcrumbNode(theNodeId){
			
			$log.debug('Calling jax-rs _breadcrumbNode service method');
			
			return eastoreUiJsonService.breadcrumbNode({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch parent tree path for some child resource
		function _breadcrumbPath(storeName, relativePath){
			
			$log.debug('Calling jax-rs _breadcrumbPath service method');
			
			return eastoreUiJsonService.breadcrumbPath({ storeName : storeName, relPath : relativePath }).$promise;					
			
		}
		
		// fetch store by name
		function _storeByName(storeName){
			
			$log.debug('Calling jax-rs _storeByName service method');
			
			return eastoreUiJsonService.storeByName({ storeName : storeName }).$promise;
			
		}		
		
		// fetch all stores
		function _storeList(){
			
			$log.debug('Calling jax-rs _storeList service method');
			
			return eastoreUiJsonService.storelist().$promise;
			
		}
		
		// fetch first-level child resources for some parent resource
		function _loadRelPath(storeName, relativePath){
			
			$log.debug('Calling jax-rs loadRelPath service method');
			
			return eastoreUiJsonService.loadRelPath({ storeName : storeName, relPath : relativePath }).$promise;		
			
		}
		
		// download a file resource
		function _downloadFile(fileId){
			
			$log.debug('Downloading file with nodeId = ' + fileId);
			
			var downloadUrl = appConstants.eastoreUiActionJaxrsService + '/download/id/' + fileId;
			
			window.location.href = downloadUrl;
			
		}		
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			addDirectory : _addDirectory,
			
			pathResourceByNodeId : _pathResourceByNodeId,
			
			pathResourceByPath : _pathResourceByPath,
			
			breadcrumbNode : _breadcrumbNode,
			
			breadcrumbPath : _breadcrumbPath,
			
			storeByName : _storeByName,
			
			storeList : _storeList,
			
			loadRelPath : _loadRelPath,
			
			downloadFile : _downloadFile
	    	
	    };
		
	}
	
	/**
	 * Service for parsing the 'urlPath' value from our angular-ui 'path' state.
	 */
	function UrlParseService($log){		
		
		// *********************************
		// Internal methods and data
		// *********************************
		
		//
		// Parse the storeName and relPath values from the urlPath
		// the urlPath should be /{storeName}/{relPath}
		//
		function _parseStoreAndRelpath(urlPath){
			
			if(urlPath.startsWith('/')){
				urlPath = urlPath.slice(1); // remove '/' from front
			}
			var _slashIndex = urlPath.indexOf('/');
			var _storeName = urlPath.substring(0, _slashIndex);
			var _relPath = urlPath.substring(_slashIndex);
			
			var data = {
				storeName : _storeName,
				relPath : _relPath
			};
			
			return data;
			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			parseStoreAndRelpath : _parseStoreAndRelpath
			
		};
		
	}

	/**
	 * Helper service for "resolving" data in our angular-ui "resolve" setup. See state configuration in app.js.
	 */
	function ResolveService($log, appConstants, urlParseService, homeRestService, EAFileUploader){
		
		//
		// resolve the current store
		//
		function _resolveCurrentStore($stateParams){
			
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
			
		}
		
		//
		// resolve the current directory path resource
		//
		function _resolveCurrentDirectory($stateParams){
			
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
		
		//
		// resolve firs-level child path resources for current directory
		//
		function _resolvePathResources($stateParams){
			
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
			
		}
		
		//
		// resolve breadcrumb tree (bottom-up path tree)
		//
		function _resolveBreadcrumb($stateParams){
			
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
		
		//
		// resolve list of all stores
		//
		function _resolveStores(){
			
			return homeRestService
				.storeList()
				.then( function ( jsonData ){
					//$log.debug('resolved prots');
					//$log.debug(JSON.stringify(jsonData));
					return jsonData;
				}, function( error ){
					alert('Error calling storeList() service method' + JSON.stringify(error));
				});			
			
		}
		
		//
		// get new instance of EAUploader
		//
		function _resolveEAUploader(){
			
			var eaUploader = new EAFileUploader({
				url: appConstants.httpUploadHandler
			});
			
			$log.debug(eaUploader.hello());
			
			return eaUploader;			
			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			resolveCurrentStore : _resolveCurrentStore,
			
			resolveCurrentDirectory : _resolveCurrentDirectory,
			
			resolvePathResources : _resolvePathResources,
			
			resolveBreadcrumb : _resolveBreadcrumb,
			
			resolveStores : _resolveStores,
			
			resolveEAUploader : _resolveEAUploader
			
		};		
		
	}
		

})();