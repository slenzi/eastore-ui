(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
	.service('resolveService', [
		'$log', 'appConstants', 'urlParseService', 'homeRestService', 'EAFileUploader', 'EAStomp', ResolveService
		]
	);
	
	/*
	 * Helper service for "resolving" data in our angular-ui "resolve" setup. See state configuration in app.js.
	 */
	function ResolveService($log, appConstants, urlParseService, homeRestService, EAFileUploader, EAStomp){
		
		var stompClient;
		
		/*
		 * resolve the current store
		 */
		function _resolveCurrentStore($stateParams){
			
			// use existing store if we have one
			if($stateParams.store){
				
				return $stateParams.store;
			
			// otherwise parse store name from urlPath, then fetch from server
			}else{

				var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
				
				//$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);

				return homeRestService
					.storeByName(parseData.storeName, parseData.relPath)
					.then( function ( jsonData ){
						return jsonData;
					}, function( error ){
						alert('Error calling storeByName(...) service method' + JSON.stringify(error));
					});
				
			}
			
		}
		
		/*
		 * resolve the current directory path resource
		 */
		function _resolveCurrentDirectory($stateParams){
			
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
				
				var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
				
				//$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
				
				storeName = parseData.storeName;
				relPathToLoad = parseData.relPath;

			}	

			// fetch directory path resource
			return homeRestService
				.pathResourceByPath(storeName, relPathToLoad)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling pathResourceByPath(...) service method' + JSON.stringify(error));
				});			
			
		}
		
		/*
		 * resolve the current resource the user wants to edit
		 */
		function _resolveCurrentEditResource($stateParams){

			var storeName;
			var currEditResource;
			var relPathToLoad;

			// use current store and current edit resource from state params
			if($stateParams.store && $stateParams.currEditResource){
				
				storeName = $stateParams.store.name;
				currEditResource = $stateParams.currEditResource;
				relPathToLoad = currEditResource.relativePath;

				// pathResObj.resourceType === \'FILE\'
			
			}
			
			/* Nothing to parse in the URL for the resource to edit...we'd have to possibly add something in components.js
			    where we initiate the state change.
			 
			// otherwise parse store name and relative path from urlPath value
			}else{
				
				$log.debug('parse store name and relpath from urlPath');
				
				var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
				
				$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
				
				storeName = parseData.storeName;
				relPathToLoad = parseData.relPath;

			}
			*/

			// fetch path resource for edit
			return homeRestService
				.pathResourceByPath(storeName, relPathToLoad)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling pathResourceByPath(...) service method' + JSON.stringify(error));
				});			
			
		}		
		
		/*
		 * resolve firs-level child path resources for current store and directory stored in $stateParams.
		 * if $stateParams does not have store or directory then attempt to parse it from the URL
		 */
		function _resolvePathResources($stateParams){
			
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
				
				var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
				
				//$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
				
				storeName = parseData.storeName;
				relPathToLoad = parseData.relPath;

			}
			
			// fetch child path resources for the current directory
			return homeRestService
				.loadRelPath(storeName, relPathToLoad)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
				});			
			
		}
		
		/*
		 * resolve firs-level child path resources for store and directory
		 */
		function _resolvePathResourcesForDirectory(store, directory){
			var storeName = store.name;
			var relPathToLoad = directory.relativePath;
			return homeRestService
				.loadRelPath(storeName, relPathToLoad)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling loadRelPath(...) service method' + JSON.stringify(error));
				});
		}
		
		/*
		 * resolve breadcrumb tree (bottom-up path tree)
		 */
		function _resolveBreadcrumb($stateParams){
			
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
				
				var parseData = urlParseService.parseStoreAndRelpath($stateParams.urlPath);
				
				//$log.debug('storeName = ' + parseData.storeName + ', relPathToLoad = ' + parseData.relPath);
				
				storeName = parseData.storeName;
				relPathToLoad = parseData.relPath;
				
			}						
		
			// return parent-tree breadcrumb
			return homeRestService
				.breadcrumbPath(storeName, relPathToLoad)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling breadcrumbPath(...) service method' + JSON.stringify(error));
				});
			
		}
		
		/*
		 * resolve list of all stores
		 */
		function _resolveStores(){
			return homeRestService
				.storeList()
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling storeList() service method' + JSON.stringify(error));
				});
		}
		
		function _resolveEditStore($stateParams){
			// use name of the store being edited
			if($stateParams.editStore && $stateParams.editStore.name){
				var storeName = $stateParams.editStore.name;
				return homeRestService
					.storeByName(storeName)
					.then( function ( jsonData ){
						return jsonData;
					}, function( error ){
						alert('Error calling storeByName() service method' + JSON.stringify(error));
					});				
			}
			
		}
		
		/*
		 * get new instance of EAUploader
		 */
		function _resolveEAUploader(){
			var eaUploader = new EAFileUploader({
				url: appConstants.httpUploadHandler
			});
			//$log.debug(eaUploader.hello());
			return eaUploader;
		}
		
		/*
		 * resolve gatekeeper categories
		 */
		function _resolveGatekeeperCategories(){
			return homeRestService
				.fetchGatekeeperCategories()
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
				});
		}
		
		/*
		 * resolve gatekeeper groups for a category
		 */
		function _resolveGatekeeperGroupsForCategory(categoryCode){
			return homeRestService
				.fetchGatekeeperGroupsForCategory(categoryCode)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperGroupsForCategory() service method' + JSON.stringify(error));
				});
		}
		
		/*
		 * resolve gatekeeper category for a group, by group code
		 */
		function _resolveGatekeeperCategoryByGroupCode(groupCode){
			return homeRestService
				.fetchGatekeeperCategoryByGroupCode(groupCode)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperCategoryByGroupCode() service method' + JSON.stringify(error));
				});
		}
		
		/*
		 * resolve gatekeeper group by group code
		 */
		function _resolveGatekeeperGroupByGroupCode(groupCode){
			return homeRestService
				.fetchGatekeeperGroupByGroupCode(groupCode)
				.then( function ( jsonData ){
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperGroupByGroupCode() service method' + JSON.stringify(error));
				});
		}	
		
		// *********************************
		// External API
		// *********************************
		return {
			
			resolveCurrentStore : _resolveCurrentStore,
			
			resolveCurrentDirectory : _resolveCurrentDirectory,
			
			resolveCurrentEditResource : _resolveCurrentEditResource,
			
			resolvePathResources : _resolvePathResources,
			resolvePathResourcesForDirectory : _resolvePathResourcesForDirectory,
			
			resolveBreadcrumb : _resolveBreadcrumb,
			
			resolveStores : _resolveStores,
			resolveEditStore : _resolveEditStore,
			
			resolveEAUploader : _resolveEAUploader,
			
			resolveGatekeeperCategories : _resolveGatekeeperCategories,
			resolveGatekeeperGroupsForCategory : _resolveGatekeeperGroupsForCategory,
			resolveGatekeeperGroupByGroupCode : _resolveGatekeeperGroupByGroupCode,
			resolveGatekeeperCategoryByGroupCode : _resolveGatekeeperCategoryByGroupCode
			
		};		
		
	}	
	
})();	