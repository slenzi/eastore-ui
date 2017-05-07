
(function(){
	
	'use strict';
	
	var mainModule = angular.module('prodoc-main');
	
	mainModule
		.service('homeRestService', [
			'appConstants', 'Base64', '$log', '$q', '$location', '$http', '$resource', HomeRestService
			]
		);
		
	mainModule
		.service('homeDataService', [
			'appConstants', HomeDataService
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
			
			storeList : _storeList,
			
			loadRelPath : _loadRelPath,
			
			downloadFile : _downloadFile
	    	
	    };
		
	}
	
	/**
	 * RESTful services provider
	 */
	function HomeDataService(appConstants, Base64, $log, $q, $location, $http, $resource){		
		
		// *********************************
		// Internal methods and data
		// *********************************
		
		var _currentProtocol;
		
		// data element bound to smart table which shows list of protocols		
		var _rawProtListData = [{
			prot : 'Loading...',
			nciProt : 'Loading...',
			title : 'Loading...',
			shortName : 'Loading...'
		}];
		
		var _childPathResources = [{
			nodeId : 'Loading...',
			parentNodeId : 'Loading...',
			childNodeId : 'Loading...',
			nodeName : 'Loading...',
			dateCreated : 'Loading...',
			dateUpdated : 'Loading...',
			storeId : 'Loading...',
			resourceType : 'Loading...',
			relativePath : 'Loading...'
		}];
		
		function _getCurrentProtocol(){
			return _currentProtocol;
		}
		
		function _setCurrentProtocol(prot){
			_currentProtocol = prot;
		}

		function _getRawProtList(){
			//$log.debug('getting raw prot list');
			return _rawProtListData;
		}

		function _setRawProtList(list){
			//$log.debug('setting raw prot list');
			//$log.debug(JSON.stringify(list));
			_rawProtListData = list;
		}

		function _getChildPathResources(){
			return _childPathResources;
		}
		
		function _setChildPathResources(childPathResources){
			_childPathResources = childPathResources;
		}
				
		function _echo(message){
			
			alert('You said => ' + message)
			
		}
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			getCurrentProtocol : _getCurrentProtocol,
			setCurrentProtocol : _setCurrentProtocol,
			
			getRawProtList : _getRawProtList,
			setRawProtList : _setRawProtList,
			
			getChildPathResources : _getChildPathResources,
			setChildPathResources : _setChildPathResources
	    	
	    };
		
	}	

})();