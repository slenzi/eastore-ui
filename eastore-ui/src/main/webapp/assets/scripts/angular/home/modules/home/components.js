(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// template for root view. this is the parent component which renders the side nav, and sets up
	// the child ui-view elements for all our other child states & components
	//
	mainModule.component('rootComponent', {
		
		bindings: { leftnavid : '<' },
		
		templateUrl : function (appConstants){
			return appConstants.contextPath + '/assets/scripts/angular/home/modules/home/views/root.jsp'
		},

		controller : function(appConstants, $log, $mdSidenav, $mdUtil, $state){
			
			this.$onInit = function() {
				$log.debug('rootComponent controller');
			};
			
			this.leftNavComponentId = appConstants.leftNavComponentId;
			
			// banner images to cycle through
			this.bannerImages = new Array();
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});			
			
			// for some reason this isn't working, so we setup a separate controller for opening/closing the nav
			// menu. see 'nacController' in controllers.js
			//
			// toggle the nav bar with the specified id
			this.toggleNav = function(navId){
				return this.buildToggler(navId);
				//return function() {
				//	$log.debug('yo');
				//	$mdSidenav(navId).toggle();
				//};				
			};
			
			//builds a toggle switch for opening/closing navigation bar
			this.buildToggler = function(navId) {
				$log.debug('buildToggler for nav ' + navId);
				return $mdUtil.debounce(function(){
					$log.debug('here');
					$mdSidenav(navId)
						.toggle()
						.then(function () {
							$log.debug("toggle " + navId + " is done");
						});
				},300);
			};

			// close the nav bar with the specified id
			this.closeNav = function(navId) {
				$log.debug('close nav ' + navId);
				$mdSidenav(navId).close()
				.then(function () {
					//$log.debug("close MyLeftNav is done");
				});
			};			
					
		},
		
		controllerAs : 'rootCtrl' // default is $ctrl		
		
	});	
	
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
		
		controller : function($log, $state){
			//$log.debug('storesHeaderComponent controller');
			
			// show the create store form
			this.showCreateStoreForm = function(){
				
				$state.go('createstore');
		
			};
			
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
	// header for create store state
	//
	mainModule.component('createStoreHeaderComponent', {
		
		bindings: { },
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/create_store_header.jsp';
		},			
		
		controller : function($log, $state){
			
			//$log.debug('createStoreHeaderComponent controller');
			
			this.cancelCreateStore = function(){
				
				$state.go('stores');
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});
	
	//
	// content for create store state
	//
	mainModule.component('createStoreContentComponent', {
		
		bindings: {
			gatekeeperCategories : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/create_store_content.jsp';
		},				
		
		controller : function($log, $state, $scope, homeRestService){
			
			//$log.debug('createStoreContentComponent controller');
			
			var thisCtrl = this;
			
			// data for the new directory
			this._newStore = {
				
				storeName : '',
				storeDesc: '',
				storePath: '',
				maxFileSizeBytes: '-1', // -1 = no limit
				
				rootDir : {
					
					dirName : 'Home',
					dirDesc : 'Root directory for store',
					
					readCat1: '',
					readGroup1: '',
					
					writeCat1: '',
					writeGroup1: '',
					
					executeCat1: '',
					executeGroup1: ''					
					
				}
				
			};
			
			// the value the user types into the read, write, and execute groups autocomplete box
			this._read1GroupSearchText = '';
			this._write1GroupSearchText = '';
			this._execute1GroupSearchText = '';
			
			// current list of read, write, and execute groups to display (based on the gatekeeper category the user selected)
			this._currentRead1Groups = [];
			this._currentWrite1Groups = [];
			this._currentExecute1Groups = [];
			
			// clear currently selected read 1 group
			this.clearSelectedRead1Group = function(){
				this._currentRead1Groups = [];
				this._read1GroupSearchText = '';
				this._newStore.rootDir.readGroup1 = '';				
			};
			// clear currently selected write 1 group
			this.clearSelectedWrite1Group = function(){
				this._currentWrite1Groups = [];
				this._write1GroupSearchText = '';
				this._newStore.rootDir.writeGroup1 = '';				
			};
			// clear currently selected execute 1 group
			this.clearSelectedExecute1Group = function(){
				this._currentExecute1Groups = [];
				this._execute1GroupSearchText = '';
				this._newStore.rootDir.executeGroup1 = '';				
			};
			
			// set current read 1 groups to display
			this.setRead1Groups = function(groups){
				this._currentRead1Groups = groups;
			};
			// set current write 1 groups to display
			this.setWrite1Groups = function(groups){
				this._currentWrite1Groups = groups;
			};
			// set current execute 1 groups to display
			this.setExecute1Groups = function(groups){
				this._currentExecute1Groups = groups;
			};			
			
			// fired when the user types into the read group autocomplete box
			this.read1GroupSearchTextChange = function(text){
				//$log.info('Text for read 1 group search changed to ' + text);
			};
			// fired when the user types into the write group autocomplete box
			this.write1GroupSearchTextChange = function(text){
				//$log.info('Text for write 1 group search changed to ' + text);
			};
			// fired when the user types into the execute group autocomplete box
			this.execute1GroupSearchTextChange = function(text){
				//$log.info('Text for execute 1 group search changed to ' + text);
			};			
			
			// fired when the user selects a new group from the read group autocomplete box
			this.read1GroupSelectedItemChange = function(group){
				//$log.info('Read 1 group changed to ' + JSON.stringify(group));
			};	
			// fired when the user selects a new group from the write group autocomplete box
			this.write1GroupSelectedItemChange = function(group){
				//$log.info('Write 1 group changed to ' + JSON.stringify(group));
			};	
			// fired when the user selects a new group from the execute group autocomplete box
			this.execute1GroupSelectedItemChange = function(group){
				//$log.info('Execute 1 group changed to ' + JSON.stringify(group));
			};				
			
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.read1GroupSearch = function(query){
				var results = query ? this._currentRead1Groups.filter( this.createFilterFor(query) ) : this._currentRead1Groups, deferred;
				return results;	
			};
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.write1GroupSearch = function(query){
				var results = query ? this._currentWrite1Groups.filter( this.createFilterFor(query) ) : this._currentWrite1Groups, deferred;
				return results;	
			};
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.execute1GroupSearch = function(query){
				var results = query ? this._currentExecute1Groups.filter( this.createFilterFor(query) ) : this._currentExecute1Groups, deferred;
				return results;	
			};			
			
			// performs a filter on a collection of gatekeeper group data,, used by our angular material auto complete boxes
			this.createFilterFor = function (query){
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(group) {
					return (group.groupName.toLowerCase().indexOf(lowercaseQuery) >= 0);
				};
			}
			
			// Fetch all gatekeeper groups for the read category
			this.read1CatChange = function(){
				
				this.clearSelectedRead1Group();
			
				var categoryCode = this._newStore.rootDir.readCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setRead1Groups(data);
					});
				
			};			
			
			// Fetch all gatekeeper groups for the write category
			this.write1CatChange = function(){
		
				this.clearSelectedWrite1Group();
			
				var categoryCode = this._newStore.rootDir.writeCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setWrite1Groups(data);
					});		
		
			};	

			// Fetch all gatekeeper groups for the execute category
			this.execute1CatChange = function(){

				this.clearSelectedExecute1Group();
			
				var categoryCode = this._newStore.rootDir.executeCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setExecute1Groups(data);
					});			
			
			};			
			
			this.cancelCreateStore = function(){
				
				$state.go('stores');
				
			};
			
			this.doCreateStore = function(){
				
				if($scope.storeForm.$valid){
				
					// call service to create store, then load store list state
					homeRestService
						.addStore(
								this._newStore.storeName, 
								this._newStore.storeDesc, 
								this._newStore.storePath,
								this._newStore.maxFileSizeBytes,
								this._newStore.rootDir.dirName,
								this._newStore.rootDir.dirDesc, 
								this._newStore.rootDir.readGroup1.groupCode, 
								this._newStore.rootDir.writeGroup1.groupCode, 
								this._newStore.rootDir.executeGroup1.groupCode)
						.then( function ( jsonData ){
							
							$log.debug('completed addStore service call');
							
							$log.debug(JSON.stringify(jsonData))
							//return jsonData;
							
							$state.go('stores');
							
						}, function( error ){
							alert('Error calling addStore(...) service method' + JSON.stringify(error));
						});					
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}
				
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
			
			var progressValue = 0;
			
			this.getProgressValue = function(){
				return progressValue;
			};
			
			this.setProgressValue = function(val){
				progressValue = val;
			};
			
			this.setCalculatedProgress = function(currVal, totalVal){
				progressValue = (currVal/totalVal)*100;
			};
			
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
											
											thisCtrl.setCalculatedProgress((i+1), resourcesToDelete.length);
											thisCtrl.reloadCurrentState();
										
									});							

							}
						}
						
						thisCtrl.setProgressValue(0);
					
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
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											thisCtrl.reloadCurrentState();
											
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
											
											thisCtrl.setCalculatedProgress((i+1), pathResources.length);
											thisCtrl.reloadCurrentState();
											
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
			directory : '<',
			gatekeeperCategories : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/create_directory_content.jsp';
		},				
		
		controller : function($log, $state, $scope, homeRestService){
			
			//$log.debug('storesContentComponent controller');
			
			var thisCtrl = this;
			
			// data for the new directory
			this._newDir = {
				
				dirName : '',
				dirDescription: '',
				
				readCat1: '',
				readGroup1: '',
				
				writeCat1: '',
				writeGroup1: '',
				
				executeCat1: '',
				executeGroup1: ''
				
			};
			
			// the value the user types into the read, write, and execute groups autocomplete box
			this._read1GroupSearchText = '';
			this._write1GroupSearchText = '';
			this._execute1GroupSearchText = '';
			
			// current list of read, write, and execute groups to display (based on the gatekeeper category the user selected)
			this._currentRead1Groups = [];
			this._currentWrite1Groups = [];
			this._currentExecute1Groups = [];
			
			// clear currently selected read 1 group
			this.clearSelectedRead1Group = function(){
				this._currentRead1Groups = [];
				this._read1GroupSearchText = '';
				this._newDir.readGroup1 = '';				
			};
			// clear currently selected write 1 group
			this.clearSelectedWrite1Group = function(){
				this._currentWrite1Groups = [];
				this._write1GroupSearchText = '';
				this._newDir.writeGroup1 = '';				
			};
			// clear currently selected execute 1 group
			this.clearSelectedExecute1Group = function(){
				this._currentExecute1Groups = [];
				this._execute1GroupSearchText = '';
				this._newDir.executeGroup1 = '';				
			};
			
			// set current read 1 groups to display
			this.setRead1Groups = function(groups){
				this._currentRead1Groups = groups;
			};
			// set current write 1 groups to display
			this.setWrite1Groups = function(groups){
				this._currentWrite1Groups = groups;
			};
			// set current execute 1 groups to display
			this.setExecute1Groups = function(groups){
				this._currentExecute1Groups = groups;
			};			
			
			// fired when the user types into the read group autocomplete box
			this.read1GroupSearchTextChange = function(text){
				//$log.info('Text for read 1 group search changed to ' + text);
			};
			// fired when the user types into the write group autocomplete box
			this.write1GroupSearchTextChange = function(text){
				//$log.info('Text for write 1 group search changed to ' + text);
			};
			// fired when the user types into the execute group autocomplete box
			this.execute1GroupSearchTextChange = function(text){
				//$log.info('Text for execute 1 group search changed to ' + text);
			};			
			
			// fired when the user selects a new group from the read group autocomplete box
			this.read1GroupSelectedItemChange = function(group){
				//$log.info('Read 1 group changed to ' + JSON.stringify(group));
			};	
			// fired when the user selects a new group from the write group autocomplete box
			this.write1GroupSelectedItemChange = function(group){
				//$log.info('Write 1 group changed to ' + JSON.stringify(group));
			};	
			// fired when the user selects a new group from the execute group autocomplete box
			this.execute1GroupSelectedItemChange = function(group){
				//$log.info('Execute 1 group changed to ' + JSON.stringify(group));
			};				
			
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.read1GroupSearch = function(query){
				var results = query ? this._currentRead1Groups.filter( this.createFilterFor(query) ) : this._currentRead1Groups, deferred;
				return results;	
			};
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.write1GroupSearch = function(query){
				var results = query ? this._currentWrite1Groups.filter( this.createFilterFor(query) ) : this._currentWrite1Groups, deferred;
				return results;	
			};
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.execute1GroupSearch = function(query){
				var results = query ? this._currentExecute1Groups.filter( this.createFilterFor(query) ) : this._currentExecute1Groups, deferred;
				return results;	
			};			
			
			// performs a filter on a collection of gatekeeper group data,, used by our angular material auto complete boxes
			this.createFilterFor = function (query){
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(group) {
					return (group.groupName.toLowerCase().indexOf(lowercaseQuery) >= 0);
				};
			}
			
			// Fetch all gatekeeper groups for the read category
			this.read1CatChange = function(){
				
				this.clearSelectedRead1Group();
			
				var categoryCode = this._newDir.readCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setRead1Groups(data);
					});
				
			};			
			
			// Fetch all gatekeeper groups for the write category
			this.write1CatChange = function(){
		
				this.clearSelectedWrite1Group();
			
				var categoryCode = this._newDir.writeCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setWrite1Groups(data);
					});		
		
			};	

			// Fetch all gatekeeper groups for the execute category
			this.execute1CatChange = function(){

				this.clearSelectedExecute1Group();
			
				var categoryCode = this._newDir.executeCat1;
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						//$log.debug(JSON.stringify(jsonData));
						//$log.debug('Groups in array = ' + jsonData.length);
						//for(var i=0; i<jsonData.length; i++){
						//	$log.debug(JSON.stringify(jsonData[i]));
						//}
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setExecute1Groups(data);
					});			
			
			};	
			
			this.doCreateDirectory = function(store, directoryResource){
				
				//alert('create directory coming soon!');
				
				//var thisCtrl = this;
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.dirForm.$valid){
					
					//alert('parentNodeId =' + directoryResource.nodeId + ', new dir name = ' + this._newDir.dirName + ', new dire desc = ' + this._newDir.dirDescription + ', read group = ' + this._newDir.readGroup1.groupCode + ', write group = ' + this._newDir.writeGroup1.groupCode + ', execute group = ' + this._newDir.executeGroup1.groupCode);
					
					// call service to create directory, then reload path state
					// addDirectory
					homeRestService
						.addDirectory(directoryResource.nodeId, this._newDir.dirName, this._newDir.dirDescription, this._newDir.readGroup1.groupCode, this._newDir.writeGroup1.groupCode, this._newDir.executeGroup1.groupCode)
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
					alert('Please fill out all required fields. Thank you.');
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
	
})();