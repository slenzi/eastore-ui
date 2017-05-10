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
			
			this.clickBreadcrumb = function(store, resource){
				
				// breadcrumb path resources should always be of resourceType DIRECTORY.
				
				//$log.debug('You clicked on breadcrumb path resource:\n\n' + JSON.stringify(resource));
				
				this.loadDirectory(store, resource);
				
			};
			
			this.loadDirectory = function(store, resource){
					
					//$stateParams.relPath = resource.relativePath;
					$stateParams.currDirResource = resource;
					//$stateParams.urlPath = $stateParams.urlPath + '/' + resource.pathName;
					//$stateParams.urlPath = '/' + $stateParams.store.name + resource.relativePath;
					$stateParams.urlPath = '/' + store.name + resource.relativePath;
					
					//$log.debug('breadcrumb click, dirNodeId = ' + $stateParams.currDirResource.nodeId + ', urlPath = ' + $stateParams.urlPath);
					
					// similar to $state.reload(), but we want to change one of our stateparams so we use transition to instead
					$state.transitionTo($state.current, $stateParams, { 
					  reload: true, inherit: false, notify: true
					});
				
			};	

			this.refreshPath = function(store, directoryResource){
				
				$log.debug('refreshing current view');
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
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
			pathresources: '<',
			store: '<',
			directory : '<'
		},
		
		//templateUrl : '/eastore-ui/assets/scripts/angular/home/modules/home/partials/path_content.jsp',
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/path_content.jsp';
		},			
		
		controller : function($log, $state, $stateParams, homeRestService){
			
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
			
			// iterate over the array of pathResource and return true if any of them are resourceType DIRECTORY
			this.haveDirectoryResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'DIRECTORY'){
						return true;
					}
				}
			};
			
			// iterate over the array of pathResource and return true if any of them are resourceType FILE
			this.haveFileResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'FILE'){
						return true;
					}
				}
			};
			
			// return true if any of the directory resources are 'selected' in the smart table. Rows that are selected
			// will have class 'st-selected' applied
			this.haveSelectedDirectoryResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'DIRECTORY' && pathResources[i].isSelected){
						return true;
					}
				}
			};
			
			// return true if any of the file resources are 'selected' in the smart table. Rows that are selected
			// will have class 'st-selected' applied
			this.haveSelectedFileResource = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'FILE' && pathResources[i].isSelected){
						return true;
					}
				}
			};

			// unselect all selected directories in our smart table
			this.unselectDirectories = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'DIRECTORY' && pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}				
			};			
			
			// unselect all selected files in our smart table
			this.unselectFiles = function(pathResources){
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'FILE' && pathResources[i].isSelected){
						pathResources[i].isSelected = false;
					}
				}				
			};
			
			// delete all selected directories
			this.deleteSelectedDirectories = function(pathResources){
				var itemsToDelete = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'DIRECTORY' && pathResources[i].isSelected){
						itemsToDelete.push(pathResources[i]);
					}
				}
				alert('Delete directories coming soon!');
			};			
			
			// delete all selected files
			this.deleteSelectedFiles = function(pathResources){
				var itemsToDelete = [];
				for(var i = 0; i<pathResources.length; i++){
					if(pathResources[i].resourceType === 'FILE' && pathResources[i].isSelected){
						itemsToDelete.push(pathResources[i]);
					}
				}
				alert('Delete files coming soon!');				
			};			
			
			this.loadStateAddDirectoryForm = function(store, directoryResource){

				alert('Add directory coming soon!');
				
				$log.debug('Upload to store = ' + store.name + ', directory relPath = ' + directoryResource.relativePath);				

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
	
})();