(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
	.service('homeRestService', [
		'appConstants', 'Base64', '$log', '$q', '$location', '$http', '$resource', HomeRestService
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
							desc : '@desc',
							readGroup1: '@readGroup1',
							writeGroup1: '@writeGroup1',
							executeGroup1: '@executeGroup1'
						}					
					},
					
					// call update directory service method
					updateDir: {
						url: appConstants.eastoreUiActionJaxrsService + '/updateDirectory',
						method: 'POST',
						isArray: false,
						params: {
							dirNodeId : '@dirNodeId',
							name : '@name',
							desc : '@desc',
							readGroup1: '@readGroup1',
							writeGroup1: '@writeGroup1',
							executeGroup1: '@executeGroup1'
						}					
					},					
					
					// call copy file service method
					copyFile: {
						url: appConstants.eastoreUiActionJaxrsService + '/copyFile',
						method: 'POST',
						isArray: false,
						params: {
							fileNodeId : '@fileNodeId',
							dirNodeId : '@dirNodeId',
							replaceExisting : '@replaceExisting'
						}					
					},
					
					// call update file service method
					updateFile: {
						url: appConstants.eastoreUiActionJaxrsService + '/updateFile',
						method: 'POST',
						isArray: false,
						params: {
							fileNodeId : '@fileNodeId',
							name : '@name',
							desc : '@desc'
						}					
					},					
					
					// call copy directory service method
					copyDirectory: {
						url: appConstants.eastoreUiActionJaxrsService + '/copyDirectory',
						method: 'POST',
						isArray: false,
						params: {
							copyDirNodeId : '@copyDirNodeId',
							destDirNodeId : '@destDirNodeId',
							replaceExisting : '@replaceExisting'
						}					
					},
					
					// call move file service method
					moveFile: {
						url: appConstants.eastoreUiActionJaxrsService + '/moveFile',
						method: 'POST',
						isArray: false,
						params: {
							fileNodeId : '@fileNodeId',
							dirNodeId : '@dirNodeId',
							replaceExisting : '@replaceExisting'
						}					
					},
					
					// call move directory service method
					moveDirectory: {
						url: appConstants.eastoreUiActionJaxrsService + '/moveDirectory',
						method: 'POST',
						isArray: false,
						params: {
							moveDirNodeId : '@moveDirNodeId',
							destDirNodeId : '@destDirNodeId',
							replaceExisting : '@replaceExisting'
						}					
					},
					
					// call remove file service method
					removeFile: {
						url: appConstants.eastoreUiActionJaxrsService + '/removeFile',
						method: 'POST',
						isArray: false,
						params: {
							fileNodeId : '@fileNodeId'
						}					
					},
					
					// call remove directory service method
					removeDirectory: {
						url: appConstants.eastoreUiActionJaxrsService + '/removeDirectory',
						method: 'POST',
						isArray: false,
						params: {
							dirNodeId : '@dirNodeId'
						}					
					},
					
					// call add store service method
					addStore : {
						url: appConstants.eastoreUiActionJaxrsService + '/addStore',
						method: 'POST',
						isArray: false,
						params: {
							storeName : '@storeName',
							storeDesc : '@storeDesc',
							storePath : '@storePath',
							maxFileSizeBytes : '@maxFileSizeBytes',
							rootDirName : '@rootDirName',
							rootDirDesc : '@rootDirDesc',
							readGroup1 : '@readGroup1',
							writeGroup1 : '@writeGroup1',
							executeGroup1 : '@executeGroup1'
						}						
					},
					
					// call update store service method
					updateStore : {
						url: appConstants.eastoreUiActionJaxrsService + '/updateStore',
						method: 'POST',
						isArray: false,
						params: {
							storeId : '@storeId',
							storeName : '@storeName',
							storeDesc : '@storeDesc',
							rootDirName : '@rootDirName',
							rootDirDesc : '@rootDirDesc',
							rootDirReadGroup1 : '@rootDirReadGroup1',
							rootDirWriteGroup1 : '@rootDirWriteGroup1',
							rootDirExecuteGroup1 : '@rootDirExecuteGroup1'
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
				},
				
				// fetch list of all gatekeeper categories
				gatekeeperCategories: {
					url: appConstants.eastoreUiJsonJaxrsService + '/gatekeeper/categories',
					method: 'GET',
					isArray: true,
					params: {}					
				},
				
				// fetch list of all gatekeeper groups for a category
				gatekeeperGroupsForCategory: {
					url: appConstants.eastoreUiJsonJaxrsService + '/gatekeeper/groups/category',
					method: 'GET',
					isArray: true,
					params: {
						storeName: '@categoryCode'
					}				
				},
				
				// fetch the category for a group, by group code
				gatekeeperCategoryForGroup: {
					url: appConstants.eastoreUiJsonJaxrsService + '/gatekeeper/category',
					method: 'GET',
					isArray: false,
					params: {
						groupCode: '@groupCode'
					}
				},
				
				gateKeeperGroupByCode: {
					url: appConstants.eastoreUiJsonJaxrsService + '/gatekeeper/group',
					method: 'GET',
					isArray: false,
					params: {
						groupCode: '@groupCode'
					}
				}
			
			});
		
		
		// *********************************
		// Internal RESTful methods
		// *********************************
				
		function _echo(msg){
			
			//$log.debug('Calling jax-rs test echo service method');
			
			return eastoreTestService.echo({ message : msg }).$promise;		
			
		}
		
		// add a new directory
		function _addDirectory(parentDirId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1){
			
			//$log.debug('Calling jax-rs _addDirectory service method');
			
			return eastoreUiActionService.addDir(
					{
						dirNodeId : parentDirId,
						name : dirName,
						desc : dirDesc,
						readGroup1: readGroup1,
						writeGroup1: writeGroup1,
						executeGroup1: executeGroup1
					}).$promise;
			
		}
		
		// update a file
		function _updateFile(fileNodeId, newName, newDesc){
			
			//$log.debug('Calling jax-rs _updateFile service method');
			
			return eastoreUiActionService.updateFile(
					{
						fileNodeId : fileNodeId,
						name : newName,
						desc : newDesc
					}).$promise;
			
		}		
		
		// update a directory
		function _updateDirectory(dirNodeId, newName, newDesc, readGroup1, writeGroup1, executeGroup1){
			
			//$log.debug('Calling jax-rs _updateDirectory service method');
			
			return eastoreUiActionService.updateDir(
					{
						dirNodeId : dirNodeId,
						name : newName,
						desc : newDesc,
						readGroup1: readGroup1,
						writeGroup1: writeGroup1,
						executeGroup1: executeGroup1
					}).$promise;
			
		}		
		
		// add a new store
		function _addStore(storeName, storeDesc, storePath, maxFileSizeBytes, rootDirName, rootDirDesc, readGroup1, writeGroup1, executeGroup1){
			
			//$log.debug('Calling jax-rs _addStore service method');
			
			return eastoreUiActionService.addStore(
					{
						storeName : storeName,
						storeDesc : storeDesc,
						storePath : storePath,
						maxFileSizeBytes : maxFileSizeBytes,
						rootDirName : rootDirName,
						rootDirDesc : rootDirDesc,
						readGroup1: readGroup1,
						writeGroup1: writeGroup1,
						executeGroup1: executeGroup1
					}).$promise;			
			
		}
		
		// update store
		function _updateStore(storeId, storeName, storeDesc, rootDirName, rootDirDesc, rootDirReadGroup1, rootDirWriteGroup1, rootDirExecuteGroup1){
			
			//$log.debug('Calling jax-rs _updateStore service method');
			
			return eastoreUiActionService.updateStore(
					{
						storeId : storeId,
						storeName : storeName,
						storeDesc : storeDesc,
						rootDirName : rootDirName,
						rootDirDesc : rootDirDesc,
						rootDirReadGroup1: rootDirReadGroup1,
						rootDirWriteGroup1: rootDirWriteGroup1,
						rootDirExecuteGroup1: rootDirExecuteGroup1
					}).$promise;			
			
		}		
		
		// copy a file
		function _copyFile(fileNodeId, dirNodeId, replaceExisting){
			
			//$log.debug('Calling jax-rs _copyFile service method');
			
			return eastoreUiActionService.copyFile(
					{
						fileNodeId : fileNodeId,
						dirNodeId : dirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// copy a directory
		function _copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting){
			
			//$log.debug('Calling jax-rs _copyDirectory service method');
			
			return eastoreUiActionService.copyDirectory(
					{
						copyDirNodeId : copyDirNodeId,
						destDirNodeId : destDirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// move a file
		function _moveFile(fileNodeId, dirNodeId, replaceExisting){
			
			//$log.debug('Calling jax-rs _moveFile service method');
			
			return eastoreUiActionService.moveFile(
					{
						fileNodeId : fileNodeId,
						dirNodeId : dirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// move a directory
		function _moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting){
			
			//$log.debug('Calling jax-rs _moveDirectory service method');
			
			return eastoreUiActionService.moveDirectory(
					{
						moveDirNodeId : moveDirNodeId,
						destDirNodeId : destDirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// remove a file
		function _removeFile(fileNodeId){
			
			//$log.debug('Calling jax-rs _removeFile service method');
			
			return eastoreUiActionService.removeFile(
					{
						fileNodeId : fileNodeId
					}).$promise;			
			
		}
		
		// remove a directory
		function _removeDirectory(dirNodeId){
			
			//$log.debug('Calling jax-rs _removeDirectory service method');
			
			return eastoreUiActionService.removeDirectory(
					{
						dirNodeId : dirNodeId
					}).$promise;			
			
		}		
		
		// fetch a specific path resource by node id.
		function _pathResourceByNodeId(theNodeId){
			
			//$log.debug('Calling jax-rs _pathResourceByNodeId service method');
			
			return eastoreUiJsonService.pathResourceByNodeId({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch a specific path resource by store name and relative path
		function _pathResourceByPath(storeName, relativePath){
			
			//$log.debug('Calling jax-rs _pathResourceByPath service method');
			
			return eastoreUiJsonService.pathResourceByPath({ storeName : storeName, relPath : relativePath }).$promise;					
			
		}		
		
		// fetch parent tree path for some child resource
		function _breadcrumbNode(theNodeId){
			
			//$log.debug('Calling jax-rs _breadcrumbNode service method');
			
			return eastoreUiJsonService.breadcrumbNode({ nodeId : theNodeId }).$promise;					
			
		}
		
		// fetch parent tree path for some child resource
		function _breadcrumbPath(storeName, relativePath){
			
			//$log.debug('Calling jax-rs _breadcrumbPath service method');
			
			return eastoreUiJsonService.breadcrumbPath({ storeName : storeName, relPath : relativePath }).$promise;					
			
		}
		
		// fetch store by name
		function _storeByName(storeName){
			
			//$log.debug('Calling jax-rs _storeByName service method');
			
			return eastoreUiJsonService.storeByName({ storeName : storeName }).$promise;
			
		}		
		
		// fetch all stores
		function _storeList(){
			
			//$log.debug('Calling jax-rs _storeList service method');
			
			return eastoreUiJsonService.storelist().$promise;
			
		}
		
		// fetch first-level child resources for some parent resource
		function _loadRelPath(storeName, relativePath){
			
			//$log.debug('Calling jax-rs loadRelPath service method');
			
			return eastoreUiJsonService.loadRelPath({ storeName : storeName, relPath : relativePath }).$promise;		
			
		}
		
		// download a file resource
		function _downloadFile(fileId){
			
			//$log.debug('Downloading file with nodeId = ' + fileId);
			
			var downloadUrl = appConstants.eastoreUiActionJaxrsService + '/download/id/' + fileId;
			
			window.location.href = downloadUrl;
			
		}
		
		// fetch all gatekeeper categories
		function _fetchGatekeeperCategories(){
			
			//$log.debug('Calling jax-rs method to fetch gatekeeper categories');
			
			return eastoreUiJsonService.gatekeeperCategories().$promise;
			
		}
		
		// fetch all gatekeeper groups for specific category
		function _fetchGatekeeperGroupsForCategory(categoryCode){
			
			//$log.debug('Calling jax-rs method to fetch gatekeeper groups for caregory code ' + categoryCode);
			
			return eastoreUiJsonService.gatekeeperGroupsForCategory({ categoryCode : categoryCode }).$promise;
			
		}
		
		// fetch gatekeeper category by group code
		function _fetchGatekeeperCategoryByGroupCode(groupCode){
			
			//$log.debug('Calling jax-rs method to fetch gatekeeper category for group code ' + groupCode);
			
			return eastoreUiJsonService.gatekeeperCategoryForGroup({ groupCode : groupCode }).$promise;
			
		}
		
		// fetch gatekeeper group by group code
		function _fetchGatekeeperGroupByGroupCode(groupCode){
			
			//$log.debug('Calling jax-rs method to fetch gatekeeper group for group code ' + groupCode);
			
			return eastoreUiJsonService.gateKeeperGroupByCode({ groupCode : groupCode }).$promise;
			
		}		
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			addStore : _addStore,
			updateStore : _updateStore,
			
			addDirectory : _addDirectory,
			updateDirectory : _updateDirectory,
			
			copyFile : _copyFile,
			updateFile : _updateFile,
			copyDirectory : _copyDirectory,
			
			moveFile : _moveFile,
			moveDirectory : _moveDirectory,
			
			removeFile : _removeFile,
			removeDirectory : _removeDirectory,
			
			pathResourceByNodeId : _pathResourceByNodeId,
			pathResourceByPath : _pathResourceByPath,
			
			breadcrumbNode : _breadcrumbNode,
			breadcrumbPath : _breadcrumbPath,
			
			storeByName : _storeByName,
			storeList : _storeList,
			
			loadRelPath : _loadRelPath,
			
			downloadFile : _downloadFile,
			
			fetchGatekeeperCategories : _fetchGatekeeperCategories,
			fetchGatekeeperGroupsForCategory : _fetchGatekeeperGroupsForCategory,
			fetchGatekeeperGroupByGroupCode : _fetchGatekeeperGroupByGroupCode,
			fetchGatekeeperCategoryByGroupCode : _fetchGatekeeperCategoryByGroupCode
	    	
	    };
		
	}	
	
	
})();	