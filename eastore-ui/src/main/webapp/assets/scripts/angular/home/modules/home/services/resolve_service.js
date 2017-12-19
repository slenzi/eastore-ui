(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
	.service('resolveService', [
		'$log', 'appConstants', 'urlParseService', 'homeRestService', 'EAFileUploader', 'EAStomp', ResolveService
		]
	);
	
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
		
		function _resolveEditStore($stateParams){
			
			// use name of the store being edited
			if($stateParams.editStore && $stateParams.editStore.name){
				var storeName = $stateParams.editStore.name;
				return homeRestService
					.storeByName(storeName)
					.then( function ( jsonData ){
						//$log.debug('resolved prots');
						//$log.debug(JSON.stringify(jsonData));
						return jsonData;
					}, function( error ){
						alert('Error calling storeByName() service method' + JSON.stringify(error));
					});				
			}
			
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
		// resolve gatekeeper category for a group, by group code
		//
		function _resolveGatekeeperCategoryByGroupCode(groupCode){
			
			$log.debug('resolving gatekeeper category for group code ' + groupCode);
			
			return homeRestService
				.fetchGatekeeperCategoryByGroupCode(groupCode)
				.then( function ( jsonData ){
					//$log.debug(JSON.stringify(jsonData));
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperCategoryByGroupCode() service method' + JSON.stringify(error));
				});			
			
		}
		
		//
		// resolve gatekeeper group by group code
		//
		function _resolveGatekeeperGroupByGroupCode(groupCode){
			
			$log.debug('resolving gatekeeper group for group code ' + groupCode);
			
			return homeRestService
				.fetchGatekeeperGroupByGroupCode(groupCode)
				.then( function ( jsonData ){
					//$log.debug(JSON.stringify(jsonData));
					return jsonData;
				}, function( error ){
					alert('Error calling fetchGatekeeperGroupByGroupCode() service method' + JSON.stringify(error));
				});			
			
		}
		
		//
		// resolve singleton instance of EAStomp client
		//
		/*
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
		*/	
		
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
			resolveEditStore : _resolveEditStore,
			
			resolveEAUploader : _resolveEAUploader,
			
			//resolveStompSocketClient : _resolveStompSocketClient,
			
			resolveGatekeeperCategories : _resolveGatekeeperCategories,
			resolveGatekeeperGroupsForCategory : _resolveGatekeeperGroupsForCategory,
			resolveGatekeeperGroupByGroupCode : _resolveGatekeeperGroupByGroupCode,
			resolveGatekeeperCategoryByGroupCode : _resolveGatekeeperCategoryByGroupCode
			
		};		
		
	}	
	
})();	