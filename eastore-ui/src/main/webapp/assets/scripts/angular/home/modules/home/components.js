(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// template for the left-hand navbar menu
	//
	mainModule.component('leftMenuComponent', {
		
		bindings: { headerTitle: '<' },
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/left_menu.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/left_menu.jsp';
		},			
		
		controller : function(appConstants, $mdSidenav, $log, $state, homeRestService){
			
			//$log.debug('leftMenuComponent controller');
			
			this.clickEchoTest = function(){
				
				homeRestService
					.echo('testing 1 2 3...')
					.then( function ( jsonData ){
						$log.debug('Result from echo() => ' + JSON.stringify(jsonData));
					}, function( error ){
						alert('Error calling echo() service method' + JSON.stringify(error));
					});				
				
			};
			
			this.clickStoreList = function(){
				
				$state.go('stores');
				
				if($mdSidenav(appConstants.leftNavComponentId).isOpen()){
					$mdSidenav(appConstants.leftNavComponentId).close();
				}				
				
			};
			
		},
		
		controllerAs : 'lmenuCtrl' // default is $ctrl
		
	});	
	
	//
	// template for the title header on every page
	//
	mainModule.component('titleHeaderComponent', {
		
		bindings: { headerTitle: '<' },
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/title_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/title_header.jsp';
		},				
		
		controller : function($log){
			//$log.debug('titleHeaderComponent controller');
		},
		
		controllerAs : 'titleCtrl' // default is $ctrl
		
	});
	
	//
	// header for store list state
	//
	mainModule.component('storeListHeaderComponent', {
		
		bindings: { stores: '<' },
		
		//template :
		//	'Protocol List'
		//,
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/store_list_header.jsp';
		},			
		
		controller : function($log){
			//$log.debug('storesHeaderComponent controller');
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
	//
	// content for store list state
	//
	mainModule.component('storeListContentComponent', {
		
		bindings: { stores: '<' },
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/store_list_content.jsp';
		},				
		
		controller : function($log, $state){
			
			//$log.debug('storesContentComponent controller');
			
			this.clickStoreHandler = function(theStore){
				
				//alert('You clicked on store:\n\n' + JSON.stringify(theStore));
				//$log.debug('current state = ' + JSON.stringify($state.current));
				//$log.debug('transitioning to \'path\' state ');
				
				var rootDirectory = theStore.rootDir;
				var newRelPath = rootDirectory.relativePath;
				var newUrlPath = '/' + theStore.name + newRelPath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					//relPath: newRelPath,
					store : theStore,
					currDirResource : rootDirectory
					});
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});

	//
	// header for path resource list state
	//
	mainModule.component('pathHeaderComponent', {
		
		bindings: {
				pathresources: '<',
				breadcrumb: '<',
				store: '<',
				directory : '<'
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/path_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/path_header.jsp';
		},			
		
		controller : function($log, $state, $stateParams){
			
			//$log.debug('pathHeaderComponent controller');
			
			this.clickBreadcrumb = function(store, directoryResource){
				
				// breadcrumb path resources should always be of resourceType DIRECTORY.
				
				//$log.debug('You clicked on breadcrumb path resource:\n\n' + JSON.stringify(resource));
				
				this.loadDirectory(store, directoryResource);
				
			};
			
			this.loadDirectory = function(store, directoryResource){
					
					//$stateParams.relPath = directoryResource.relativePath;
					$stateParams.currDirResource = directoryResource;
					//$stateParams.urlPath = $stateParams.urlPath + '/' + directoryResource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + directoryResource.relativePath;
					$stateParams.urlPath = '/' + store.name + directoryResource.relativePath;
					
					//$log.debug('breadcrumb click, dirNodeId = ' + $stateParams.currDirResource.nodeId + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});
				
			};	

			this.refreshPath = function(store, directoryResource){
				
				$log.debug('refreshing current view');
				
				this.loadDirectory(store, directoryResource);
				
				//var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				//$state.go('path', {
				//	urlPath: newUrlPath,
				//	store : store,
				//	currDirResource : directoryResource
				//	});				
				
			};
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});

	//
	// content for path resource list state
	//
	mainModule.component('pathContentComponent', {
		
		bindings: {
			pathresources: '<',
			store: '<',
			directory : '<'
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/path_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/path_content.jsp';
		},			
		
		controller : function($log, $mdDialog, $state, $stateParams, homeRestService, resourceClipboardService){
			
			//$log.debug('pathContentComponent controller');
			
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
					
				}else{

					alert('You clicked on a path resource with an unrecognized resource type:\n\n' + JSON.stringify(resource));

				}
				
			};
			
			/*
			// iterate over the array of pathResource and return true if any of them are resourceType DIRECTORY
			this.haveDirectoryResource = function(pathResources){
				return this.havePathResourceType(pathResources, 'DIRECTORY');
			};
			// iterate over the array of pathResource and return true if any of them are resourceType FILE
			this.haveFileResource = function(pathResources){
				return this.havePathResourceType(pathResources, 'FILE');
			};
			// return true if any of the directory resources are 'selected' in the smart table. Rows that are selected
			// will have class 'st-selected' applied
			this.haveSelectedDirectoryResource = function(pathResources){
				return this.haveSelectedPathResourceType(pathResources, 'DIRECTORY');
			};
			// return true if any of the file resources are 'selected' in the smart table. Rows that are selected
			// will have class 'st-selected' applied
			this.haveSelectedFileResource = function(pathResources){
				return this.haveSelectedPathResourceType(pathResources, 'FILE');
			};
			// unselect all selected directories in our smart table
			this.unselectDirectories = function(pathResources){
				this.unselectPathResourceType(pathResources, 'DIRECTORY');
			};			
			// unselect all selected files in our smart table
			this.unselectFiles = function(pathResources){
				this.unselectPathResourceType(pathResources, 'FILE');			
			};
			// delete all selected directories
			this.deleteSelectedDirectories = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'DIRECTORY');
				alert('Delete directories coming soon!');
			};			
			// delete all selected files
			this.deleteSelectedFiles = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'FILE');
				alert('Delete files coming soon!');
			};
			// copy all selected directories (copy to clipboard)
			this.copySelectedDirectories = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'DIRECTORY');
				alert('Copying directories coming soon!');
			};
			// copy all selected files (copy to clipboard)
			this.copySelectedFiles = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'FILE');
				alert('Copying files coming soon!');
			};
			// cut all selected directories (cut to clipboard in preparation for moving)
			this.cutSelectedDirectories = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'DIRECTORY');
				alert('Cut/move directories coming soon!');
			};
			// cut all selected files (cut to clipboard in preparation for moving)
			this.cutSelectedFiles = function(pathResources){
				var items = this.getSelectedPathResourcesType(pathResources, 'FILE');
				alert('Cut/move files coming soon!');	
			};
			*/
			
			// cut selected resources
			this.cutSelectedResources = function(sourceStore, sourceDirectory, pathResources){
				var items = this.getSelectedPathResources(pathResources);
				resourceClipboardService.setOperation('cut');
				resourceClipboardService.setSourceStore(sourceStore);
				resourceClipboardService.setSourceDirectory(sourceDirectory);
				resourceClipboardService.setResources(items);
			};	

			// copy selected resources
			this.copySelectedResources = function(sourceStore, sourceDirectory, pathResources){
				var items = this.getSelectedPathResources(pathResources);
				resourceClipboardService.setOperation('copy');
				resourceClipboardService.setSourceStore(sourceStore);
				resourceClipboardService.setSourceDirectory(sourceDirectory);
				resourceClipboardService.setResources(items);
			};
			
			// delete selected resources
			this.deleteSelectedResources = function(sourceStore, sourceDirectory, pathResources){

				var resourcesToDelete = this.getSelectedPathResources(pathResources);
				
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
											
											thisCtrl.reloadCurrentState();
										
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
											
											thisCtrl.reloadCurrentState();
										
									});							

							}
						}
					
				}, function() {
					
						$log.debug('Copy operation canceled.');
					
				});						

			};			
			
			// return tre/false if the clipboard has resources
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
										
										thisCtrl.reloadCurrentState();
										
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
										
										thisCtrl.reloadCurrentState();
										
										//thisCtrl.loadPathState(destinationStore, destinationDirectory);

									
								});							
							
						}else{
							$log.error('Cannot copy resource, unknown resource type. Node ID = ' + pathResources[i].nodeId + 
								', Resource Type + ' + pathResources[i].resourceType);
						}
						
					}
					
				}, function() {
					
					$log.debug('Copy operation canceled.');
					
				});				
				
			};
			
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
										
										thisCtrl.reloadCurrentState();
										
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
										
										thisCtrl.reloadCurrentState();
										
										//thisCtrl.loadPathState(destinationStore, destinationDirectory);

									
								});							
							
						}else{
							$log.error('Cannot move resource, unknown resource type. Node ID = ' + pathResources[i].nodeId + 
								', Resource Type + ' + pathResources[i].resourceType);
						}
						
					}
					
				}, function() {
					
					$log.debug('Move operation canceled.');
					
				});
			
			};		
			
			// get all selected items n the collection of pathResources
			this.getSelectedPathResources = function(pathResources, type){
				var items = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						items.push(pathResources[i]);
					}
				}
				return items;
			};			

			// get all selected items, of the specified type, in the collection of pathResources
			this.getSelectedPathResourcesType = function(pathResources, type){
				var items = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						items.push(pathResources[i]);
					}
				}
				return items;
			};
			
			// return true if any of the resources are selected in collection of path resources
			this.haveSelectedPathResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						return true;
					}
				}
				return false;
			};			
			
			// return true if any of the resources, of the specified type, are selected in collection of path resources
			this.haveSelectedPathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						return true;
					}
				}
				return false;
			};
			
			// unselect any selected resources in the collection of path resources
			this.unselectPathResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}	
			};			

			// unselect any selected resources, of the specified type, in the collection of path resources
			this.unselectPathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type && pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}	
			};
			
			// iterate over the collection of path resources an return true if any of them are of the specified type
			this.havePathResourceType = function(pathResources, type){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === type){
						return true;
					}
				}
			};
			
			this.loadStateAddDirectoryForm = function(store, directoryResource){

				//alert('Add directory coming soon!');
				
				$log.debug('Add directory to store = ' + store.name + ', under directory relPath = ' + directoryResource.relativePath);

				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('createdir', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				

			};			

			this.loadStateUploadForm = function(store, directoryResource){
				
				//alert('Upload coming soon!');
				
				$log.debug('Upload to store = ' + store.name + ', directory relPath = ' + directoryResource.relativePath);
				
				
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

			this.reloadCurrentState = function(){
				
				$state.reload();
			
			};
			
			this.openMenu = function ($mdMenu, event){
				
				var originatorEv = event;
				
				$mdMenu.open(event);
				
			};
			
		},
		
		controllerAs : 'pathCtrl' // default is $ctrl
		
	});
	
	//
	// header for store list state
	//
	mainModule.component('uploadHeaderComponent', {
		
		bindings: { 
			store : '<',
			directory : '<'		
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/upload_header.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/upload_header.jsp';
		},		
		
		controller : function($log, $state){
			
			//$log.debug('uploadHeaderComponent controller');
			
			this.cancelUpload = function(store, directoryResource){
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				
				
			}
			
		},
		
		controllerAs : 'uploadCtrl' // default is $ctrl
		
	});	
	
	//
	// content for store list state
	//
	mainModule.component('uploadContentComponent', {
		
		bindings: {
			uploader : '<',
			store : '<',
			directory : '<'
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/upload_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/upload_content.jsp';
		},
		
		controller : function($log, $scope, $state, $stateParams, EAFileUploader, appConstants, $mdDialog){
			
			$log.debug('uploadContentComponent controller');
			
			//$log.debug(JSON.stringify($stateParams));
			
			this.startUpload = function(uploader, store, directoryResource){
				
				$log.debug('store = ' + store.name + ', directory = ' + directoryResource.relativePath);
				
				var confirm = $mdDialog.confirm()
					.parent(angular.element(document.body))
					.title('Upload Confirmation')
					.content("Please confirm upload.")
					.ariaLabel('Continue Upload')
					.ok('Continue')
					.cancel('Cancel')
					.targetEvent(event);
				
				$mdDialog.show(confirm).then(function() {
					
					// set required params
					uploader.addFormValue('storeId', store.id);
					uploader.addFormValue('dirNodeId', directoryResource.nodeId);
					
					// add Spring Security Cross Site Request Forgery (CSRF) token
					// We store the token in a meta tag on every page. (see common header jsp)
					// Also stored as a hidden input field on every page
					//myFsUploader.addFormValue('_csrf', getContentByMetaTagName('_csrf'));
					
					// upload all files in queue as one single upload
					//myFsUploader.doUpload(_uploadProgressHandler, _uploadAllCompleteHandler);
					
					// upload all files in queue as separate, individual uploads.
					uploader.doUploadSingular(
						// callback for handling updated progress event from eaUploader
						function(event){
							var progressValue = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
							$log.debug('main progress = ' + progressValue);
							$scope.$apply();							
						},
						// callback for handling completion of single file upload event from eaUploader
						function (event){
							$log.debug('Upload of single file complete.');
						},
						// callback for handling completion of all uploads event from eaUploader
						function(event){
							
							$log.debug('Upload complete');
							
							var newUrlPath = '/' + store.name + directoryResource.relativePath;
							
							$state.go('path', {
								urlPath: newUrlPath,
								store : store,
								currDirResource : directoryResource
								});							
							
						}
					);
						
				}, function() {
					
					$log.debug('Uploade operation canceled.');
					
				});				
				
			};
			
		},
		
		controllerAs : 'uploadCtrl' // default is $ctrl
		
	});

	//
	// header for create directory state
	//
	mainModule.component('createDirHeaderComponent', {
		
		bindings: {
			store : '<',
			directory : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/create_directory_header.jsp';
		},			
		
		controller : function($log, $state){
			
			//$log.debug('storesHeaderComponent controller');
			
			this.cancelCreate = function(store, directoryResource){
				
				$log.debug('cancel create directory');
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				
				
			};				
			
		},
		
		controllerAs : 'dirCtrl' // default is $ctrl
		
	});

	//
	// content for create directory state
	//
	mainModule.component('createDirContentComponent', {
		
		bindings: {
			store : '<',
			directory : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/create_directory_content.jsp';
		},				
		
		controller : function($log, $state, $scope, homeRestService){
			
			//$log.debug('storesContentComponent controller');
			
			// data for the new directory
			this._newDir = {
				dirName : '',
				dirDescription: ''
			};
			
			this.doCreateDirectory = function(store, directoryResource){
				
				//alert('create directory coming soon!');
				
				var thisCtrl = this;
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.dirForm.$valid){
					
					// call service to create directory, then reload path state
					// addDirectory
					homeRestService
						.addDirectory(directoryResource.nodeId, this._newDir.dirName, this._newDir.dirDescription)
						.then( function ( jsonData ){
							
							$log.debug('completed addDirectory service call');
							
							$log.debug(JSON.stringify(jsonData))
							//return jsonData;
							thisCtrl.loadPathState(store, directoryResource);
							
						}, function( error ){
							alert('Error calling addDirectory(...) service method' + JSON.stringify(error));
						});

					//this.loadPathState(store, directoryResource);
					
				}else{
					alert('Please fill out all fields. Thank you.');
				}
				
				$log.debug('New dir name = ' + this._newDir.dirName);
				
			};

			this.cancelCreate = function(store, directoryResource){
				
				$log.debug('cancel create directory');
				
				this.loadPathState(store, directoryResource);			
				
			};

			this.loadPathState = function(store, directoryResource){
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});
				
			};
			
		},
		
		controllerAs : 'dirCtrl' // default is $ctrl
		
	});	
	
})();;