(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for edit store state
	//
	mainModule.component('editStoreHeaderComponent', {
		
		bindings: {
			editStoreModel : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_store_header.jsp';
		},			
		
		controller : function($log, $state, $mdDialog, homeRestService){
			
			//$log.debug('editStoreHeaderComponent controller');
			
			this.cancelEdit = function(){
				
				//$log.debug('cancel edit store');
				
				$state.go('stores');				
				
			};
			
			this.rebuildSearchIndex = function(storeId){
				
			    var confirm = $mdDialog.confirm()
		          .title('Would you like to re-build the search index for the store?')
		          .textContent('This will wipe and rebuild the Lucene search index for all files in the store.')
		          .ariaLabel('Re-build Search Index')
		          //.targetEvent(ev)
		          .ok('Yes, continue!')
		          .cancel('No, cancel.');
			    
				$mdDialog.show(confirm).then(function() {
						
					$log.debug('Rebuilding search index for store ' + storeId);
					
					homeRestService.rebuildStoreIndex(storeId)
						.then( function ( jsonData ){
							
							$mdDialog.show(
								      $mdDialog.alert()
								        //.parent(angular.element(document.querySelector('#popupContainer')))
								        .clickOutsideToClose(true)
								        .title('Re-build Confirmation')
								        .textContent('You have successfully triggered the re0-build process for the store search index.')
								        .ariaLabel('Re-build Confirmation')
								        .ok('Got it!')
								        //.targetEvent(ev)
								    );								
							
						}, function( error ){
							alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
						});					
					
					}, function() {
						
					});			    
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});
	
	//
	// content for edit store state
	//
	mainModule.component('editStoreContentComponent', {
		
		bindings: {
			gatekeeperCategories : '<',
			editStoreModel : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_store_content.jsp';
		},				
		
		controller : function($log, $state, $scope, homeRestService, sharedDataService){
			
			//$log.debug('editStoreContentComponent controller');
			
			var thisCtrl = this;
			
			// the value the user types into the read, write, and execute groups autocomplete box
			this._read1GroupSearchText = '';
			this._write1GroupSearchText = '';
			this._execute1GroupSearchText = '';
			
			// clear currently selected read 1 group
			this.clearSelectedRead1Group = function(){
				this.editStoreModel.rootDir.groupsForReadCat1 = [];
				this.editStoreModel.rootDir.readGroup1 = '';
				this._read1GroupSearchText = '';
			};
			// clear currently selected write 1 group
			this.clearSelectedWrite1Group = function(){
				this.editStoreModel.rootDir.groupsForWriteCat1 = [];
				this.editStoreModel.rootDir.writeGroup1 = '';
				this._write1GroupSearchText = '';
			};
			// clear currently selected execute 1 group
			this.clearSelectedExecute1Group = function(){
				this.editStoreModel.rootDir.groupsForExecuteCat1 = [];
				this.editStoreModel.rootDir.executeGroup1 = '';
				this._execute1GroupSearchText = '';
			};				
			
			// set current read 1 groups to display
			this.setRead1Groups = function(groups){
				this.editStoreModel.rootDir.groupsForReadCat1 = groups;
			};
			// set current write 1 groups to display
			this.setWrite1Groups = function(groups){
				this.editStoreModel.rootDir.groupsForWriteCat1 = groups;
			};
			// set current execute 1 groups to display
			this.setExecute1Groups = function(groups){
				this.editStoreModel.rootDir.groupsForExecuteCat1 = groups;
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
				$log.info('Read 1 group changed to ' + JSON.stringify(group));
			};
			// fired when the user selects a new group from the write group autocomplete box
			this.write1GroupSelectedItemChange = function(group){
				$log.info('Write 1 group changed to ' + JSON.stringify(group));
			};
			// fired when the user selects a new group from the execute group autocomplete box
			this.execute1GroupSelectedItemChange = function(group){
				$log.info('Execute 1 group changed to ' + JSON.stringify(group));
			};			
			
			// returns a list of groups to display in the read group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.read1GroupSearch = function(query){
				var results = query ? this.editStoreModel.rootDir.groupsForReadCat1.filter( this.createFilterFor(query) ) : this.editStoreModel.rootDir.groupsForReadCat1, deferred;
				return results;	
			};
			// returns a list of groups to display in the write group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.write1GroupSearch = function(query){
				var results = query ? this.editStoreModel.rootDir.groupsForWriteCat1.filter( this.createFilterFor(query) ) : this.editStoreModel.rootDir.groupsForWriteCat1, deferred;
				return results;	
			};
			// returns a list of groups to display in the execute group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.execute1GroupSearch = function(query){
				var results = query ? this.editStoreModel.rootDir.groupsForExecuteCat1.filter( this.createFilterFor(query) ) : this.editStoreModel.rootDir.groupsForExecuteCat1, deferred;
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
				var categoryCode = this.editStoreModel.rootDir.readCat1.categoryCode;
				
				if(categoryCode === 'None'){ // 'None' value set in select box in edit_store_content.jsp
					return;
				}
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					})
					.then( function(data) {
						thisCtrl.setRead1Groups(data);
					});
				
			};

			// Fetch all gatekeeper groups for the write category
			this.write1CatChange = function(){
				
				this.clearSelectedWrite1Group();
				var categoryCode = this.editStoreModel.rootDir.writeCat1.categoryCode;

				if(categoryCode === 'None'){ // 'None' value set in select box in edit_store_content.jsp
					return;
				}				
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					})
					.then( function(data) {
						thisCtrl.setWrite1Groups(data);
					});
				
			};
			
			// Fetch all gatekeeper groups for the execute category
			this.execute1CatChange = function(){
				
				this.clearSelectedExecute1Group();
				var categoryCode = this.editStoreModel.rootDir.executeCat1.categoryCode;

				if(categoryCode === 'None'){ // 'None' value set in select box in edit_store_content.jsp
					return;
				}				
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					})
					.then( function(data) {
						thisCtrl.setExecute1Groups(data);
					});
				
			};			

			this.cancelEdit = function(store, directoryResource){
				
				//$log.debug('cancel edit directory');
				
				thisCtrl.viewStoreList();			
				
			};
			
			this.viewStoreList = function(){
				
				$state.go('stores');
				
			};
			
			this.doEditStore = function(){
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.storeForm.$valid){
					
					sharedDataService.setProgressBarEnabled(true);
					
					// call service to update store, then reload store list view
					homeRestService
						.updateStore(
								this.editStoreModel.storeId,
								this.editStoreModel.storeName,
								this.editStoreModel.storeDesc,
								this.editStoreModel.rootDir.dirName, 
								this.editStoreModel.rootDir.dirDescription, 
								this.editStoreModel.rootDir.readGroup1.groupCode, 
								this.editStoreModel.rootDir.writeGroup1.groupCode, 
								this.editStoreModel.rootDir.executeGroup1.groupCode)
						.then( function ( jsonData ){
							
							sharedDataService.setProgressBarEnabled(false);
							
						}, function( error ){
							alert('Error calling updateStore(...) service method' + JSON.stringify(error));
							sharedDataService.setProgressBarEnabled(false);
						})
						.then( function ( ){
							
							thisCtrl.viewStoreList();
							
						});
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}				
				
			};
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
})();