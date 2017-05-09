
(function(){
	
	'use strict';
	
	var mainModule = angular.module('prodoc-main');
	
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

		var eastoreuiService = $resource(
			appConstants.eastoreuiJaxrsService, { }, {
				
				// call echo service which relays to eastore echo service
				echo: {
					url: appConstants.eastoreuiJaxrsService + '/test/echo',
					method: 'GET',
					isArray: false,
					params: {
						message : '@message'
					}					
				},
				
				// fetch a path resource by its node id
				pathResourceByNodeId: {
					url: appConstants.eastoreuiJaxrsService + '/ui/pathresource/node',
					method: 'GET',
					isArray: false,
					params: {
						nodeId : '@nodeId'
					}	
				},
				
				// fetch list of all stores
				storeByName: {
					url: appConstants.eastoreuiJaxrsService + '/ui/store/name',
					method: 'GET',
					isArray: false,
					params: {
						storeName : '@storeName'
					}					
				},				
				
				// fetch list of all stores
				storelist: {
					url: appConstants.eastoreuiJaxrsService + '/ui/stores',
					method: 'GET',
					isArray: true,
					params: {}					
				},
				
				// fetch list of first-level child resource under the resource with the relPath
				loadRelPath: {
					url: appConstants.eastoreuiJaxrsService + '/ui/loadRelPath',
					method: 'GET',
					isArray: true,
					params: {
						storeName: '@storeName',
						relPath : '@relPath'
					}	
				},
				
				// fetch breadcrumb tree for some path resource by node id
				breadcrumbNode: {
					url: appConstants.eastoreuiJaxrsService + '/ui/breadcrumb/node',
					method: 'GET',
					isArray: true,
					params: {
						nodeId : '@nodeId'
					}	
				},
				
				// fetch breadcrumb tree for some path resource by relPath
				breadcrumbPath: {
					url: appConstants.eastoreuiJaxrsService + '/ui/breadcrumb/path',
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
			
			return eastoreuiService.echo({ message : msg }).$promise;		
			
		}
		
		// fetch a specific path resource by node id.
		function _pathResourceByNodeId(theNodeId){
			
			$log.debug('Calling jax-rs _pathResourceByNodeId service method');
			
			return eastoreuiService.pathResourceByNodeId({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch parent tree path for some child resource
		function _breadcrumbNode(theNodeId){
			
			$log.debug('Calling jax-rs _breadcrumbNode service method');
			
			return eastoreuiService.breadcrumbNode({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch parent tree path for some child resource
		function _breadcrumbPath(storeName, relativePath){
			
			$log.debug('Calling jax-rs _breadcrumbPath service method');
			
			return eastoreuiService.breadcrumbPath({ storeName : storeName, relPath : relativePath }).$promise;					
			
		}
		
		// fetch store by name
		function _storeByName(storeName){
			
			$log.debug('Calling jax-rs _storeByName service method');
			
			return eastoreuiService.storeByName({ storeName : storeName }).$promise;
			
		}		
		
		// fetch all stores
		function _storeList(){
			
			$log.debug('Calling jax-rs _storeList service method');
			
			return eastoreuiService.storelist().$promise;
			
		}
		
		// fetch first-level child resources for some parent resource
		function _loadRelPath(storeName, relativePath){
			
			$log.debug('Calling jax-rs loadRelPath service method');
			
			return eastoreuiService.loadRelPath({ storeName : storeName, relPath : relativePath }).$promise;		
			
		}
		
		// download a file resource
		function _downloadFile(fileId){
			
			$log.debug('Downloading file with nodeId = ' + fileId);
			
			var downloadUrl = appConstants.eastoreuiJaxrsService + '/ui/download/id/' + fileId;
			
			window.location.href = downloadUrl;
			
		}		
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			pathResourceByNodeId : _pathResourceByNodeId,
			
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