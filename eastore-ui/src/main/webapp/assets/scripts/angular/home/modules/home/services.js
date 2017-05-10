
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

})();