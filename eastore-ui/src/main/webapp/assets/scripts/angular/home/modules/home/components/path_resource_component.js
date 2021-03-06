(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for path resource list state
	//
	mainModule.component('pathHeaderComponent', {
		
		//
		// < : one-way data binding
		// = : two-way data binding
		//
		bindings: {
				
			// no longer resolved. we now load the pathresources using our shared data service
			//pathresources: '<',
			
			breadcrumb: '<',
			store: '<',
			directory : '<'
				
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/path_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/path_header.jsp';
		},			
		
		controller : function($log, $scope, $state, $stateParams, resolveService, sharedDataService){
			
			var thisCtrl = this;	
			
			this.clickBreadcrumb = function(store, directoryResource){
				
				// breadcrumb path resources should always be of resourceType DIRECTORY.
				
				//$log.debug('You clicked on breadcrumb path resource:\n\n' + JSON.stringify(resource));
				
				this.loadDirectory(store, directoryResource);
				
			};
			
			this.loadDirectory = function(store, directoryResource){
					
					//$stateParams.relPath = directoryResource.relativePath;
				
					$stateParams.store = store;
					$stateParams.currDirResource = directoryResource;
					
					//$stateParams.urlPath = $stateParams.urlPath + '/' + directoryResource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + directoryResource.relativePath;
					
					$stateParams.urlPath = '/' + store.name + directoryResource.relativePath;
					
					//$log.debug('breadcrumb click, dirNodeId = ' + $stateParams.currDirResource.nodeId + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our $stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});
				
			};	

			//
			// re-load the data for the current working directory
			//
			this.refreshPath = function(store, directoryResource){
				
				$log.debug('refreshing current view');
				
				sharedDataService.setProgressBarEnabled(true);
				
				// this next line reloads the current state (not desirable)
				//this.loadDirectory(store, directoryResource);
				
				// re-resolved the path resources and load them into our shared data service.
				// TODO - use store and directory from shared data service rather than $stateParams
				resolveService.resolvePathResources($stateParams).then(function (data){
					sharedDataService.setPathResources(data);
					sharedDataService.setProgressBarEnabled(false);
				});
				
			};
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});

	//
	// content for path resource list state
	//
	mainModule.component('pathContentComponent', {
		
		bindings: {
			
			// no longer resolved. we now load the pathresources using our shared data service
			//pathresources: '<',
				
			store: '<',
			directory : '<'
			
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/path_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/path_content.jsp';
		},			
		
		controller : function($log, $scope, $mdDialog, $state, $stateParams, sharedDataService, homeRestService, resolveService, resourceClipboardService, stompService){
			
			var thisCtrl = this;
			var progressValue = 0;
			
			// load current working store and directory into shared data service
			// resolve first-level path resources for current working directory
			// initialize stomp messaging service
			this.$onInit = function() {
				
				$log.debug('pathContentComponent controller initialized');
				
				// put the current working store & directory into our shared data service so
				// we can access them from our stomp messaging service
				sharedDataService.setStore(thisCtrl.store);
				sharedDataService.setDirectory(thisCtrl.directory);
				
				// resolve first-level path resources for the current working directory
				thisCtrl.resolvePathResources();
				
				thisCtrl.initStompMessaging();

			};
			
			//
			// initialize stomp messaging web socket connection
			//
			this.initStompMessaging = function(){
				
				stompService.subscribe([{				
						destination : '/topic/resource/change',
						frameHandler : thisCtrl.stompHandlerResourceChangeMessage
					},{				
						destination : '/topic/action/socket/connect',
						frameHandler : thisCtrl.stompHandlerConnectReplyMessages
					},{				
						destination : '/user/topic/file/task',
						frameHandler : thisCtrl.stompHandlerFileSystemTaskMessage
					},{				
						destination : '/user/topic/action',
						frameHandler : thisCtrl.stompHandlerUserActionMessage
					}]);	
				
			};
			
			//
			// process stomp connect reply messages from eastore
			//
			this.stompHandlerConnectReplyMessages = function(socketMessage){
				$log.info('STOMP socket connect reply = ' + JSON.stringify(socketMessage));				
			};
			
			//
			// process stomp user action status messages from eastore
			//
			this.stompHandlerUserActionMessage = function(socketMessage){
				
				var message = JSON.parse(socketMessage.body);
				
				$log.info('STOMP user action message = ' + JSON.stringify(message, null, 2))
				
				// TODO - check taskType, if ZIP then get downloadId attribute and call service method to download file
				var taskType = message.taskType;
				if(taskType === 'ZIP'){
					
					var downloadId = message.attributes.downloadId;

					$mdDialog.show({
						controller: function($scope, $mdDialog){
							$scope.hide = function() {
								$mdDialog.hide();
							};
							$scope.cancel = function() {
								$mdDialog.cancel();
							};
							$scope.doDownload = function(comenceDownload) {
								$mdDialog.hide(comenceDownload);
							};							
						},
						template:
							'<md-dialog aria-label="Download Ready!">' +
							'	<form ng-cloak>' +
							'		<md-toolbar>' +
							'			<div class="md-toolbar-tools">' +
							'				<h2>Download Ready!</h2>' +
							'				<span flex></span>' +
							'				<md-button class="md-icon-button" ng-click="cancel()">' +
							'					<md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
							'				</md-button>' +
							'			</div>' +
							'		</md-toolbar>' +
							'		<md-dialog-content>' +
							'			<div class="md-dialog-content">' +
							'				Your zip download is ready!' +
							'			</div>' +
							'		</md-dialog-content>' +
							'		<md-dialog-actions layout="row">' +
							'			<span flex></span>' +
							'			<md-button ng-click="doDownload(true)">' +
							'				Download' +
							'			</md-button>' +							
							'			<md-button ng-click="doDownload(false)">' +
							'				Cancel' +
							'			</md-button>' +
							'		</md-dialog-actions>' +
							'	</form>' +
							'</md-dialog>'							
						,
						parent: angular.element(document.body),
						//targetEvent: ev,
						clickOutsideToClose:true
						//,fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
					})
					.then(function(comenceDownload) {
						if(comenceDownload){
							homeRestService.downloadLogFile(downloadId);
						}
					}, function() {
						$log.debug('User cancelled the zip-download');
					});					
					
				}
				
			};
			
			//
			// process stomp file system task status messages from eastore
			//
			this.stompHandlerFileSystemTaskMessage = function(socketMessage){
				
				//$log.info('STOMP file service task = ' + JSON.stringify(socketMessage));
				
				var task = JSON.parse(socketMessage.body);
				var progress = task.progress;
				
				//$log.info('STOMP file service task = ' + JSON.stringify(task, null, 2));
				
				//if(progress == '100'){
				//	sharedDataService.removeFileServiceTask(task);
				//}else{
				sharedDataService.addFileServiceTask(task);
				//}

				setTimeout(function(){
					$scope.$apply();
				},500);				
				
			};
			
			//
			// process stomp resource change messages from eastore file service
			//
			this.stompHandlerResourceChangeMessage = function(socketMessage){
				
				//$log.info('STOMP resource changed = ' + JSON.stringify(socketMessage));
				
				var messageData = JSON.parse(socketMessage.body);
				var messageCode = messageData.code;
				var messageNodeId = messageData.nodeId;
				var currStore = sharedDataService.getStore();
				var currDir = sharedDataService.getDirectory();
				var currDirId = currDir.nodeId;
				
				if($state.current.name === 'path' && messageCode == 'DIRECTORY_CONTENTS_CHANGED' && currDirId === messageNodeId){
					resolveService.resolvePathResourcesForDirectory(currStore, currDir).then(function (data){
						sharedDataService.setPathResources(data);
					});
				}
				
			};

			// resolve path resources and load them into our shared data service
			this.resolvePathResources = function(){
				sharedDataService.setProgressBarEnabled(true);
				resolveService.resolvePathResourcesForDirectory(sharedDataService.getStore(), sharedDataService.getDirectory())
					.then(function (data){
						sharedDataService.setPathResources(data);
						sharedDataService.setProgressBarEnabled(false);
					}
				);
			};

			// get current set of path resources from our shared data service
			this.getPathResources = function(){
				return sharedDataService.getPathResources();
			};			
			
			this.getProgressValue = function(){
				return progressValue;
			};
			
			this.setProgressValue = function(val){
				progressValue = val;
			};
			
			this.setCalculatedProgress = function(currVal, totalVal){
				progressValue = (currVal/totalVal)*100;
			};
			
			// handle click on a resource. either download file or view directory contents
			this.clickResourceHandler = function(store, resource){
				
				if(resource.resourceType === 'FILE'){
					
					homeRestService.downloadFile(resource.nodeId);
				
				}else if(resource.resourceType === 'DIRECTORY'){
				
					//$log.debug('You clicked on directory path resource:\n\n' + JSON.stringify(resource));
					//$log.debug(JSON.stringify($stateParams));
					
					$stateParams.relPath = resource.relativePath;
					$stateParams.currDirResource = resource;
					//$stateParams.urlPath = $stateParams.urlPath + '/' + resource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + resource.relativePath;
					$stateParams.urlPath = '/' + store.name + resource.relativePath;
					
					//$log.debug('directory click, dirNodeId = ' + $stateParams.currDirResource.nodeId + 
					//	', relPath = ' + $stateParams.relPath + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});
					
					//
					// TODO - rather than reloading the entire state we should just re-fetch our 'pathresource' * breadcrumb resolve
					//
					
				}else{
					alert('You clicked on a path resource with an unrecognized resource type:\n\n' + JSON.stringify(resource));
				}
				
			};
			
			this.downloadSelectedResources = function(sourceStore, sourceDirectory, pathResources){
				
				// require read permission on all selected resources
				var resourcesToDownload = this.getSelectedPathResources(pathResources, true, false, false);

				var resourceIds = [];
				var nextResource;
				for(var i=0; i<resourcesToDownload.length; i++){
					nextResource = resourcesToDownload[i];
					resourceIds.push(nextResource.nodeId);
				}
				
				$log.debug('List of resources to download: ' + resourceIds.toString());
				
				homeRestService
					.triggerZipDownload(resourceIds);
					
					// for some reason this service call works, but the error function is triggered. I see so error in
					// the chrome debugger. Maybe try firtefox...
					
					/*
					.then( function ( jsonData ){
						$log.debug('Triggered zip-download process on server');
					}, function( error ){
						alert('Error calling triggerZipDownload(...) service method' + JSON.stringify(error));
					});
					*/
				
			};
			
			// handle click for edit resource
			this.clickEditResourceHandler = function(store, directory, resourceToEdit){
				if(resourceToEdit.resourceType === 'FILE'){
					this.loadEditFile(store, directory, resourceToEdit);
				}else if(resourceToEdit.resourceType === 'DIRECTORY'){
					this.loadEditDirectory(store, directory, resourceToEdit);
				}else{
					alert('You clicked on a path resource with an unrecognized resource type:\n\n' + JSON.stringify(resource));
				}
			};	

			// load the edit directory form
			this.loadEditDirectory = function(currentStore, currentDirectory, childDirectoryToEdit){
				var newUrlPath = '/' + currentStore.name + currentDirectory.relativePath;
				$state.go('editdir', {
					urlPath: newUrlPath,
					store : currentStore,
					currDirResource : currentDirectory,
					currEditResource : childDirectoryToEdit
					});
			}
			
			// load the edit file form
			this.loadEditFile = function(currentStore, currentDirectory, fileToEdit){
				var newUrlPath = '/' + currentStore.name + currentDirectory.relativePath;
				$state.go('editfile', {
					urlPath: newUrlPath,
					store : currentStore,
					currDirResource : currentDirectory,
					currEditResource : fileToEdit
					});
			}			
			
			// cut selected resources
			this.cutSelectedResources = function(sourceStore, sourceDirectory, pathResources){
				
				// require read and write permission on pathresources when performing a cut operation
				var items = this.getSelectedPathResources(pathResources, true, true, false);
				
				resourceClipboardService.setOperation('cut');
				resourceClipboardService.setSourceStore(sourceStore);
				resourceClipboardService.setSourceDirectory(sourceDirectory);
				resourceClipboardService.setResources(items);
			};	

			// copy selected resources
			this.copySelectedResources = function(sourceStore, sourceDirectory, pathResources){
				
				// require read permission on pathresources when performing a copy operation
				var items = this.getSelectedPathResources(pathResources, true, false, false);
				
				resourceClipboardService.setOperation('copy');
				resourceClipboardService.setSourceStore(sourceStore);
				resourceClipboardService.setSourceDirectory(sourceDirectory);
				resourceClipboardService.setResources(items);
			};
			
			// delete selected resources
			this.deleteSelectedResources = function(sourceStore, sourceDirectory, pathResources){

				// require read & write on pathresources when performing a delete operation
				var resourcesToDelete = this.getSelectedPathResources(pathResources, true, true, false);
				
				var thisCtrl = this;
				
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title('Delete Confirmation')
					.content("Please confirm that you want to delete the selected resources. There is no undo feature!")
					.ariaLabel('Continue Deletion')
					.ok('Continue')
					.cancel('Cancel')
					.targetEvent(event);

				$mdDialog.show(confirm).then(
					function() {
						
						thisCtrl.setCalculatedProgress(0, resourcesToDelete.length);

						for(var i=0; i<resourcesToDelete.length; i++){
							if(resourcesToDelete[i].resourceType === 'FILE'){
								
								var theFileResource = resourcesToDelete[i];
								
								homeRestService
									.removeFile(theFileResource.nodeId)
									.then( function ( jsonData ){
										
										$log.debug('completed deletion of file ' + theFileResource.nodeId);
										
									}, function( error ){
										alert('Error calling copyFile(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
										
											$log.debug('file resource deleted, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), resourcesToDelete.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection
											//thisCtrl.reloadCurrentState();
										
									});									
								
							}else if(resourcesToDelete[i].resourceType === 'DIRECTORY'){

								var theDirectoryResource = resourcesToDelete[i];
								
								homeRestService
									.removeDirectory(theDirectoryResource.nodeId)
									.then( function ( jsonData ){
										
										$log.debug('completed deletion of directory ' + theDirectoryResource.nodeId);
										
									}, function( error ){
										alert('Error calling removeDirectory(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
										
											$log.debug('directory resource deleted, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), resourcesToDelete.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection										
											//thisCtrl.reloadCurrentState();
										
									});							

							}
						}
						
						thisCtrl.setProgressValue(0);
					
				}, function() {
					
						$log.debug('Copy operation canceled.');
					
				});

				

			};			
			
			// return true/false if the clipboard has resources
			this.haveResourcesOnClipboard = function(){
				return resourceClipboardService.haveResources();
			};
			
			// execute paste operation for clipboard
			this.pasteItemsFromClipboard = function(destStore, destDirectory){
				
				if(!resourceClipboardService.haveResources()){
					alert('No items on the clipboard');
					return;
				}
				var operation = resourceClipboardService.getOperation();
				var sourceStore = resourceClipboardService.getSourceStore();
				var sourceDirectory = resourceClipboardService.getSourceDirectory();
				var resources = resourceClipboardService.getResources();
				switch(operation){
					case 'copy':
						this.doCopy(sourceStore, sourceDirectory, destStore, destDirectory, resources);
						break;
					case 'cut':
						this.doMove(sourceStore, sourceDirectory, destStore, destDirectory, resources);
						break;
				}
				
			};
			
			this.doCopy = function(sourceStore, sourceDirectory, destinationStore, destinationDirectory, pathResources){
				
				if(sourceDirectory.nodeId === destinationDirectory.nodeId){
					alert('Cannot copy resources. The source and destination directories are the same.');
					return;
				}
				
				var thisCtrl = this;
				
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title('Copy Confirmation')
					.content("Please confirm that you want to copy the resources to this directory.")
					.ariaLabel('Continue Copy')
					.ok('Continue')
					.cancel('Cancel')
					.targetEvent(event);

				$mdDialog.show(confirm).then(
					function() {

						thisCtrl.setCalculatedProgress(0, pathResources.length);
					
						for(var i=0; i<pathResources.length; i++){
							if(pathResources[i].resourceType === 'FILE'){
								
								var theFileResource = pathResources[i];
								
								homeRestService
									.copyFile(theFileResource.nodeId, destinationDirectory.nodeId, true)
									.then( function ( jsonData ){
										
										$log.debug('completed copy of file ' + theFileResource.nodeId);									
										
									}, function( error ){
										alert('Error calling copyFile(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
										
											$log.debug('file resource copied, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection								
											//thisCtrl.reloadCurrentState();
											//thisCtrl.loadPathState(destinationStore, destinationDirectory);
										
									});
								
							}else if(pathResources[i].resourceType === 'DIRECTORY'){
								
								var theDirectoryResource = pathResources[i];
								
								homeRestService
									.copyDirectory(theDirectoryResource.nodeId, destinationDirectory.nodeId, true)
									.then( function ( jsonData ){
										
										$log.debug('completed copy of directory ' + theDirectoryResource.nodeId);									
										
									}, function( error ){
										alert('Error calling copyDirectory(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
		
											$log.debug('directory resource copied, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection
											//thisCtrl.reloadCurrentState();
											//thisCtrl.loadPathState(destinationStore, destinationDirectory);

										
									});							
								
							}else{
								$log.error('Cannot copy resource, unknown resource type. Node ID = ' + pathResources[i].nodeId + 
									', Resource Type + ' + pathResources[i].resourceType);
							}
							
						}
						
						thisCtrl.setProgressValue(0);
					
				}, function() {
					
					$log.debug('Copy operation canceled.');
					
				});				
				
			};
			
			// perform move operation
			this.doMove = function (sourceStore, sourceDirectory, destinationStore, destinationDirectory, pathResources){

				if(sourceDirectory.nodeId === destinationDirectory.nodeId){
					alert('Cannot move resources. The source and destination directories are the same.');
					return;
				}
				
				var thisCtrl = this;
				
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title('Move Confirmation')
					.content("Please confirm that you want to move the resources to this directory.")
					.ariaLabel('Continue Move')
					.ok('Continue')
					.cancel('Cancel')
					.targetEvent(event);

				$mdDialog.show(confirm).then(
					function() {

						thisCtrl.setCalculatedProgress(0, pathResources.length);
					
						for(var i=0; i<pathResources.length; i++){
							if(pathResources[i].resourceType === 'FILE'){
								
								var theFileResource = pathResources[i];
								
								homeRestService
									.moveFile(theFileResource.nodeId, destinationDirectory.nodeId, true)
									.then( function ( jsonData ){
										
										$log.debug('completed move of file ' + theFileResource.nodeId);									
										
									}, function( error ){
										alert('Error calling moveFile(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
										
											$log.debug('file resource moved, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection											
											//thisCtrl.reloadCurrentState();
											//thisCtrl.loadPathState(destinationStore, destinationDirectory);
										
									});
								
							}else if(pathResources[i].resourceType === 'DIRECTORY'){
								
								var theDirectoryResource = pathResources[i];
								
								homeRestService
									.moveDirectory(theDirectoryResource.nodeId, destinationDirectory.nodeId, true)
									.then( function ( jsonData ){
										
										$log.debug('completed move of directory ' + theDirectoryResource.nodeId);									
										
									}, function( error ){
										alert('Error calling moveDirectory(...) service method' + JSON.stringify(error));
									})
									.then( function ( jsonData ){
		
											$log.debug('directory resource moved, reload path state to update view');
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											
											// we now reload path resources when we recieve a resource change event from our stomp messaging web socket connection										
											//thisCtrl.reloadCurrentState();
											//thisCtrl.loadPathState(destinationStore, destinationDirectory);

										
									});							
								
							}else{
								$log.error('Cannot move resource, unknown resource type. Node ID = ' + pathResources[i].nodeId + 
									', Resource Type + ' + pathResources[i].resourceType);
							}
							
						}
						
						thisCtrl.setProgressValue(0);
					
				}, function() {
					
					$log.debug('Move operation canceled.');
					
				});
			
			};

			/**
			 * Get all selected items in the collection of pathResources
			 *
			 * pathResources - the array of PathResources to iterate over
			 * requireRead - resource canRead bit must also be true
			 * requireWrite - resource canWrite bit must also be true
			 * requireExecute - resource canExecute bit must also be true
			 */
			this.getSelectedPathResources = function(pathResources, requireRead, requireWrite, requireExecute){
				var items = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						if(requireRead && requireWrite && requireExecute){
							if(pathResources[i].canRead && pathResources[i].canWrite && pathResources[i].canExecute && pathResources[i].canRead === true && pathResources[i].canWrite === true && pathResources[i].canExecute === true){
								items.push(pathResources[i]);
							}
						}else if(requireRead && requireWrite){
							if(pathResources[i].canRead && pathResources[i].canWrite && pathResources[i].canRead === true && pathResources[i].canWrite === true){
								items.push(pathResources[i]);
							}							
						}else if(requireRead && requireExecute){
							if(pathResources[i].canRead && pathResources[i].canExecute && pathResources[i].canRead === true && pathResources[i].canExecute === true){
								items.push(pathResources[i]);
							}							
						}else if(requireWrite && requireExecute){
							if(pathResources[i].canWrite && pathResources[i].canExecute && pathResources[i].canWrite === true && pathResources[i].canExecute === true){
								items.push(pathResources[i]);
							}							
						}else if(requireRead){
							if(pathResources[i].canRead && pathResources[i].canRead === true){
								items.push(pathResources[i]);
							}							
						}else if(requireWrite){
							if(pathResources[i].canWrite && pathResources[i].canWrite === true){
								items.push(pathResources[i]);
							}								
						}else if(requireExecute){
							if(pathResources[i].canExecute && pathResources[i].canExecute === true){
								items.push(pathResources[i]);
							}								
						}else{
							items.push(pathResources[i]);
						}
					}
				}
				return items;
			};				

			/**			
			 * get all selected items, of the specified type, in the collection of pathResources
			 */
			this.getSelectedPathResourcesType = function(pathResources, type){
				var items = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						items.push(pathResources[i]);
					}
				}
				return items;
			};
			
			/**			
			 * return true if any of the resources are selected in collection of path resources
			 */
			this.haveSelectedPathResource = function(pathResources){
				if(!pathResources){
					return;
				}
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						return true;
					}
				}
				return false;
			};			
			
			/**			
			 * return true if any of the resources, of the specified type, are selected in collection of path resources
			 */
			this.haveSelectedPathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						return true;
					}
				}
				return false;
			};
			
			/**			
			 * select ll resources in the collection of path resources
			 */
			this.selectAllPathResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					pathResources[i].isSelected = true;
				}	
			};				
			
			/**			
			 * unselect any selected resources in the collection of path resources
			 */
			this.unselectPathResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}	
			};			

			/**			
			 *  unselect any selected resources, of the specified type, in the collection of path resources
			 */
			this.unselectPathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}	
			};
			
			/**			
			 * iterate over the collection of path resources an return true if any of them are of the specified type
			 */
			this.havePathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type){
						return true;
					}
				}
			};
			
			this.loadStateAddDirectoryForm = function(store, directoryResource){

				//alert('Add directory coming soon!');
				
				//$log.debug('Add directory to store = ' + store.name + ', under directory relPath = ' + directoryResource.relativePath);

				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('createdir', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				

			};			

			this.loadStateUploadForm = function(store, directoryResource){
				
				//alert('Upload coming soon!');
				
				//$log.debug('Upload to store = ' + store.name + ', directory relPath = ' + directoryResource.relativePath);
				
				//$stateParams.store = store;
				//$stateParams.currDirResource = directoryResource;
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('upload', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				
				
				//$state.transitionTo('upload', $stateParams, { 
				//	reload: true, inherit: false, notify: true
				//});				
				
				//$state.go('upload', {
				//	store : store,
				//	currDirResource : directoryResource
				//});
				
			};
			
			this.loadPathState = function(store, directoryResource){
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});
				
			};

			
			// re-loads the current state. Not exactly desirable because it will close and re-initialize our websocket/stomp connections in our parent root state.
			this.reloadCurrentState = function(){	
				$state.reload();
			};
			
			this.openMenu = function ($mdMenu, event){
				
				var originatorEv = event;
				
				$mdMenu.open(event);
				
			};
			
			// handle search for the search autocomplete box
			this.querySearch = function(store, searchText){
				
				$log.debug('search text = ' + searchText);
				
				var storeId = store.id;
				
				if(searchText.length > 2){
					return homeRestService
						.searchBasicContent(storeId, searchText)
						.then( function ( jsonData ){
							
							//$log.debug('Search results = ' + JSON.stringify(jsonData));
							if(jsonData.hits != null){
								return jsonData.hits;
							}else{
								return [];
							}
							
						}, function( error ){
							alert('Error perform search' + JSON.stringify(error));
						});					
				}else{
					$log.debug('search term too short = ' + searchText);
					return [];
				}			
				
			};
			
			this.selectedSearchHitChange = function(hit){
				
				//$log.debug('selected hit => ' + JSON.stringify(hit));
				
				if(hit != null){
					homeRestService.downloadFile(hit.resourceId);
				}
				
			};
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});	
	
})();	