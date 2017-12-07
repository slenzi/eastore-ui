
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
			'$log', 'appConstants', 'urlParseService', 'homeRestService', 'EAFileUploader', 'EAStomp', ResolveService
			]
		);	

	mainModule
		.service('resourceClipboardService', [
			'$log', ResourceClipboardService
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
		function _addDirectory(parentDirId, dirName, dirDesc, readGroup1, writeGroup1, executeGroup1){
			
			$log.debug('Calling jax-rs _addDirectory service method');
			
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
		
		// add a new store
		function _addStore(storeName, storeDesc, storePath, maxFileSizeBytes, rootDirName, rootDirDesc, readGroup1, writeGroup1, executeGroup1){
			
			$log.debug('Calling jax-rs _addStore service method');
			
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
		
		// copy a file
		function _copyFile(fileNodeId, dirNodeId, replaceExisting){
			
			$log.debug('Calling jax-rs _copyFile service method');
			
			return eastoreUiActionService.copyFile(
					{
						fileNodeId : fileNodeId,
						dirNodeId : dirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// copy a directory
		function _copyDirectory(copyDirNodeId, destDirNodeId, replaceExisting){
			
			$log.debug('Calling jax-rs _copyDirectory service method');
			
			return eastoreUiActionService.copyDirectory(
					{
						copyDirNodeId : copyDirNodeId,
						destDirNodeId : destDirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// move a file
		function _moveFile(fileNodeId, dirNodeId, replaceExisting){
			
			$log.debug('Calling jax-rs _moveFile service method');
			
			return eastoreUiActionService.moveFile(
					{
						fileNodeId : fileNodeId,
						dirNodeId : dirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// move a directory
		function _moveDirectory(moveDirNodeId, destDirNodeId, replaceExisting){
			
			$log.debug('Calling jax-rs _moveDirectory service method');
			
			return eastoreUiActionService.copyDirectory(
					{
						moveDirNodeId : moveDirNodeId,
						destDirNodeId : destDirNodeId,
						replaceExisting : replaceExisting
					}).$promise;			
			
		}
		
		// remove a file
		function _removeFile(fileNodeId){
			
			$log.debug('Calling jax-rs _removeFile service method');
			
			return eastoreUiActionService.removeFile(
					{
						fileNodeId : fileNodeId
					}).$promise;			
			
		}
		
		// remove a directory
		function _removeDirectory(dirNodeId){
			
			$log.debug('Calling jax-rs _removeDirectory service method');
			
			return eastoreUiActionService.removeDirectory(
					{
						dirNodeId : dirNodeId
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
		
		// fetch all gatekeeper categories
		function _fetchGatekeeperCategories(){
			
			$log.debug('Calling jax-rs method to fetch gatekeeper categories');
			
			return eastoreUiJsonService.gatekeeperCategories().$promise;
			
		}
		
		// fetch all gatekeeper groups for specific category
		function _fetchGatekeeperGroupsForCategory(categoryCode){
			
			$log.debug('Calling jax-rs method to fetch gatekeeper groups for caregory code ' + categoryCode);
			
			return eastoreUiJsonService.gatekeeperGroupsForCategory({ categoryCode : categoryCode }).$promise;
			
		}		
		
		// *********************************
		// External API
		// *********************************
	    return {
	    	
			echo : _echo,
			
			addStore : _addStore,
			
			addDirectory : _addDirectory,
			
			copyFile : _copyFile,
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
			fetchGatekeeperGroupsForCategory : _fetchGatekeeperGroupsForCategory
	    	
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
	function ResolveService($log, appConstants, urlParseService, homeRestService, EAFileUploader, EAStomp){
		
		var stompClient;
		
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

			// fetch directory path resource
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
		// resolve the current resource the user wants to edit
		//
		function _resolveCurrentEditResource($stateParams){
			
			$log.debug('Resolving current edit resource');
			
			//$log.debug(JSON.stringify($stateParams));

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
					$log.debug('resolved current edit resource, storeName = ' + storeName + ', relPathToLoad = ' + relPathToLoad);
					$log.debug(JSON.stringify(jsonData))
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
		
		//
		// resolve gatekeeper categories
		//
		function _resolveGatekeeperCategories(){
			
			return homeRestService
			.fetchGatekeeperCategories()
			.then( function ( jsonData ){
				//$log.debug(JSON.stringify(jsonData));
				return jsonData;
			}, function( error ){
				alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
			});				
			
		}
		
		//
		// resolve gatekeeper groups for a category
		//
		function _resolveGatekeeperGroupsForCategory(categoryCode){
			
			return homeRestService
			.fetchGatekeeperGroupsForCategory(categoryCode)
			.then( function ( jsonData ){
				//$log.debug(JSON.stringify(jsonData));
				return jsonData;
			}, function( error ){
				alert('Error calling fetchGatekeeperGroupsForCategory() service method' + JSON.stringify(error));
			});				
			
		}		
		
		//
		// resolve singleton instance of EAStomp client
		//
        function _resolveStompSocketClient($state, $stateParams){

            if(!stompClient){

                $log.debug('Instantiating new instance of EAStomp client');
                stompClient = new EAStomp({
                        sockJsUrl: appConstants.eastoreStompSockJsUrl
                });
                stompClient.setDebug(_stompSocketDebug);
                stompClient.connect(_myStompConnect, _myStompConnectError);

                //stompClient.setDebug(function(str){                                                                                                                                                                                                               
                //  $log.debug('STOMP Debug => ' + str);                                                                                                                                                                                                            
                //});                                                                                                                                                                                                                                               
                //stompClient.connect(                                                                                                                                                                                                                              
                //  function(frame){                                                                                                                                                                                                                                
                //      var sub = stompClient.subscribe('/topic/test', function(socketMessage){                                                                                                                                                                     
                //          $log.debug('STOMP Received Test Message => ' + JSON.stringify(socketMessage));                                                                                                                                                          
                //      });                                                                                                                                                                                                                                         
                //  },                                                                                                                                                                                                                                              
                //  function(error){                                                                                                                                                                                                                                
                //      $log.error('STOMP Error => ' + JSON.stringify(error));                                                                                                                                                                                      
                //  });                                                                                                                                                                                                                                             

            }else{
                    $log.debug('Fetching existing instance of EAStomp client');
                    return stompClient;
            }

		}
		function _stompSocketDebug(str){
		        $log.debug('STOMP Debug = ' + str);
		}
		function _myStompConnect(frame){
		        var subscriptTest = stompClient.subscribe(
		        		'/topic/test', _myStompReceiveTestMessages);
		        var subscriptResourceChange = stompClient.subscribe(
		        		'/topic/resource/change', _myStompReceiveResourceChangeMessages);
		}
		function _myStompConnectError(error){
		        $log.debug('_onStompConnectError...');
		        //$log.debug(error.headers.message);                                                                                                                                                                                                                    
		        $log.debug('STOMP Error = ' + JSON.stringify(error));
		}
		function _myStompReceiveTestMessages(socketMessage){
		        $log.info('STOMP Received = ' + JSON.stringify(socketMessage));
		}
		function _myStompReceiveResourceChangeMessages(socketMessage){
		        $log.info('STOMP Resource Changed = ' + JSON.stringify(socketMessage));
		        $log.info('Current state = ' + $state.current.name);
		        
		        //
		        // $state is not defined. Can we simply inject it into our resolve service?
		        // in fact can we inject all other items we need, (i.e. $stateParams)
		        //
		        if($state.current.name == 'path'){
		                // reload the 'path' state so user sees updated data that changed on server                                                                                                                                                                     
		                $state.reload();
		        }
		}		
		
		// *********************************
		// External API
		// *********************************
		return {
			
			resolveCurrentStore : _resolveCurrentStore,
			
			resolveCurrentDirectory : _resolveCurrentDirectory,
			
			resolveCurrentEditResource : _resolveCurrentEditResource,
			
			resolvePathResources : _resolvePathResources,
			
			resolveBreadcrumb : _resolveBreadcrumb,
			
			resolveStores : _resolveStores,
			
			resolveEAUploader : _resolveEAUploader,
			
			resolveStompSocketClient : _resolveStompSocketClient,
			
			resolveGatekeeperCategories : _resolveGatekeeperCategories,
			resolveGatekeeperGroupsForCategory : _resolveGatekeeperGroupsForCategory
			
		};		
		
	}
	
	/**
	 * Service for storing resource data for clipboard (cut/cipy/paste) operations
	 */
	function ResourceClipboardService($log){		
		
		// *********************************
		// Internal methods and data
		// *********************************
		
		var operation;
		var sourceStore;
		var sourceDirectory;
		var clipboard = [];
		
		function _setOperation(op){
			$log.debug('setting clipboard operation to ' + op);
			operation = op;
		}
		
		function _getOperation(){
			return operation;
		}
		
		function _setSourceDirectory(directory){
			$log.debug('adding source directory to clipboard');
			sourceDirectory = directory;
		}

		function _getSourceDirectory(){
			return sourceDirectory;
		}		
		
		function _setSourceStore(store){
			$log.debug('adding source store to clipboard');
			sourceStore = store;
		}

		function _getSourceStore(){
			return sourceStore;
		}
		
		// add path resources to the clipboard
		function _setResources(resources){
			$log.debug('adding resources to clipboard');
			//for(var i = 0; i<resources.length; i++){
			//	clipboard.push(resources[i]);
			//}
			clipboard = [].concat(resources);
		}
		
		// get resources from clipboard
		function _getResources(){
				return clipboard;
		}
		
		// check if the clipboard has any resuorces
		function _haveResources(){
			return clipboard.length > 0 ? true : false;
		}
		
		// remove all resources from clipboard
		function _clear(){
			clipboard = [];			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			setOperation : _setOperation,
			getOperation : _getOperation,
			
			setSourceDirectory : _setSourceDirectory,
			getSourceDirectory : _getSourceDirectory,
			
			setSourceStore : _setSourceStore,
			getSourceStore : _getSourceStore,
			
			setResources : _setResources,
			getResources : _getResources,
			haveResources : _haveResources,
			clear : _clear
			
		};
		
	}	
		

})();