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
					},
					
					// trigger process which rebuilds lucene search index for store
					rebuildStoreIndex : {
						url: appConstants.eastoreUiActionJaxrsService + '/store/reindex',
						method: 'POST',
						isArray: false,
						params: {
							storeId : '@storeId'
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
			return eastoreTestService.echo({ message : msg }).$promise;
		}
		
		// add a new directory
		function _addDirectory(parentDirId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1){
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
			return eastoreUiActionService.updateFile(
				{
					fileNodeId : fileNodeId,
					name : newName,
					desc : newDesc
				}).$promise;
		}		
		
		// update a directory
		function _updateDirectory(dirNodeId, newName, newDesc, readGroup1, writeGroup1, executeGroup1){
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
			return eastoreUiActionService.copyFile(
				{
					fileNodeId : fileNodeId,
					dirNodeId : dirNodeId,
					replaceExisting : replaceExisting
				}).$promise;
		}
		
		// copy a directory
		function _copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting){
			return eastoreUiActionService.copyDirectory(
				{
					copyDirNodeId : copyDirNodeId,
					destDirNodeId : destDirNodeId,
					replaceExisting : replaceExisting
				}).$promise;
		}
		
		// move a file
		function _moveFile(fileNodeId, dirNodeId, replaceExisting){
			return eastoreUiActionService.moveFile(
				{
					fileNodeId : fileNodeId,
					dirNodeId : dirNodeId,
					replaceExisting : replaceExisting
				}).$promise;
		}
		
		// move a directory
		function _moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting){
			return eastoreUiActionService.moveDirectory(
				{
					moveDirNodeId : moveDirNodeId,
					destDirNodeId : destDirNodeId,
					replaceExisting : replaceExisting
				}).$promise;
		}
		
		// remove a file
		function _removeFile(fileNodeId){
			return eastoreUiActionService.removeFile(
				{
					fileNodeId : fileNodeId
				}).$promise;
		}
		
		// remove a directory
		function _removeDirectory(dirNodeId){
			return eastoreUiActionService.removeDirectory(
				{
					dirNodeId : dirNodeId
				}).$promise;
		}
		
		// trigger rebuild of search index for store
		function _rebuildStoreIndex(storeId){
			return eastoreUiActionService.rebuildStoreIndex(
				{
					storeId : storeId
				}).$promise;
		}		
		
		// fetch a specific path resource by node id.
		function _pathResourceByNodeId(theNodeId){
			return eastoreUiJsonService.pathResourceByNodeId({ nodeId : theNodeId }).$promise;
		}
		
		// fetch a specific path resource by store name and relative path
		function _pathResourceByPath(storeName, relativePath){
			return eastoreUiJsonService.pathResourceByPath({ storeName : storeName, relPath : relativePath }).$promise;
		}		
		
		// fetch parent tree path for some child resource
		function _breadcrumbNode(theNodeId){
			return eastoreUiJsonService.breadcrumbNode({ nodeId : theNodeId }).$promise;
		}
		
		// fetch parent tree path for some child resource
		function _breadcrumbPath(storeName, relativePath){
			return eastoreUiJsonService.breadcrumbPath({ storeName : storeName, relPath : relativePath }).$promise;
		}
		
		// fetch store by name
		function _storeByName(storeName){
			return eastoreUiJsonService.storeByName({ storeName : storeName }).$promise;
		}		
		
		// fetch all stores
		function _storeList(){
			return eastoreUiJsonService.storelist().$promise;
		}
		
		// fetch first-level child resources for some parent resource
		function _loadRelPath(storeName, relativePath){
			return eastoreUiJsonService.loadRelPath({ storeName : storeName, relPath : relativePath }).$promise;
		}
		
		// download a file resource
		function _downloadFile(fileId){
			var downloadUrl = appConstants.eastoreUiActionJaxrsService + '/download/id/' + fileId;
			window.location.href = downloadUrl;
		}
		
		// fetch all gatekeeper categories
		function _fetchGatekeeperCategories(){
			return eastoreUiJsonService.gatekeeperCategories().$promise;
		}
		
		// fetch all gatekeeper groups for specific category
		function _fetchGatekeeperGroupsForCategory(categoryCode){
			return eastoreUiJsonService.gatekeeperGroupsForCategory({ categoryCode : categoryCode }).$promise;
		}
		
		// fetch gatekeeper category by group code
		function _fetchGatekeeperCategoryByGroupCode(groupCode){
			return eastoreUiJsonService.gatekeeperCategoryForGroup({ groupCode : groupCode }).$promise;
		}
		
		// fetch gatekeeper group by group code
		function _fetchGatekeeperGroupByGroupCode(groupCode){
			return eastoreUiJsonService.gateKeeperGroupByCode({ groupCode : groupCode }).$promise;
		}
		
		// check if there is an AuthWorldUser object in the session.
		// does NOT validate the user or their login data
		function _haveAuthWorldUserInSession(){
			
			return $http.get(appConstants.eastoreUiAuthJaxrsService + '/authworld/haveuser').then(function(response) {
				// service returns text/plain, so convert to boolean
				return (response.data == 'true');
			});			
			
		}
		
		// check if there is an AuthWorldUser object in the session.
		// Will validate the user and their login data
		function _haveValidAuthWorldUserInSession(){
			
			return $http.get(appConstants.eastoreUiAuthJaxrsService + '/authworld/havevaliduser').then(function(response) {
				// service returns text/plain, so convert to boolean
				return (response.data == 'true');
			});			
			
		}
		
		// attempt to auto log in the user using data from authworld cookie
		function _autoLoginAuthWorldUser(relayState){
			
			return $http.get(appConstants.eastoreUiAuthJaxrsService + '/authworld/autologin').then(function(response) {
				// service returns text/plain, so convert to boolean
				return (response.data == 'true');
			});		
			
		}
		
		// attempt to auto log in the user using data from authworld cookie
		function _buildAuthWorldHandOffUrl(relayState){
			
			return $http.get(appConstants.eastoreUiAuthJaxrsService + '/authworld/handoffurl', {
						params: { relayState : relayState }
					}).then(function(response) {
						// service returns text/plain
						return response.data;
					});			
			
		}
		
		// check if the currently logged in user is an authworld admin
		function _isAdmin(){
			
			return $http.get(appConstants.eastoreUiAuthJaxrsService + '/authworld/isadmin').then(function(response) {
				// service returns text/plain, so convert to boolean
				return (response.data == 'true');
			});			
			
		}
		
		// return an html/text pathresource download tree, showing all files and directories for the directory provided
		function _getPathResourceDownloadTree(dirId){
			return $http.get(appConstants.eastoreUiTreeJaxrsService + '/download/dirId/' + dirId).then(function(response) {
				// service returns text/html
				return response.data;
			});
		}
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			haveAuthWorldUserInSession : _haveAuthWorldUserInSession,
			haveValidAuthWorldUserInSession : _haveValidAuthWorldUserInSession,
			autoLoginAuthWorldUser : _autoLoginAuthWorldUser,
			buildAuthWorldHandOffUrl : _buildAuthWorldHandOffUrl,
			isAdmin : _isAdmin,
			
			addStore : _addStore,
			updateStore : _updateStore,
			rebuildStoreIndex : _rebuildStoreIndex,
			
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
			fetchGatekeeperCategoryByGroupCode : _fetchGatekeeperCategoryByGroupCode,
			
			getPathResourceDownloadTree : _getPathResourceDownloadTree
	    	
	    };
		
	}	
	
	
})();	