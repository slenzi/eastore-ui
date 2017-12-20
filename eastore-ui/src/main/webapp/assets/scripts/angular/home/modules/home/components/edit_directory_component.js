(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for edit directory state
	//
	mainModule.component('editDirHeaderComponent', {
		
		bindings: {
			store : '<',
			directory : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_directory_header.jsp';
		},			
		
		controller : function($log, $state){
			
			//$log.debug('editDirHeaderComponent controller');
			
			this.cancelEdit = function(store, directoryResource){
				
				//$log.debug('cancel edit directory');
				
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
	// content for edit directory state
	//
	mainModule.component('editDirContentComponent', {
		
		bindings: {
			store : '<',
			directory : '<',
			//directoryToEdit : '<',
			gatekeeperCategories : '<',
			editDirModel : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_directory_content.jsp';
		},				
		
		controller : function($log, $state, $scope, homeRestService){
			
			//$log.debug('editDirContentComponent controller');
			
			var thisCtrl = this;
			
			// the value the user types into the read, write, and execute groups autocomplete box
			this._read1GroupSearchText = '';
			this._write1GroupSearchText = '';
			this._execute1GroupSearchText = '';
			
			// clear currently selected read 1 group
			this.clearSelectedRead1Group = function(){
				this.editDirModel.groupsForReadCat1 = [];
				this.editDirModel.readGroup1 = '';
				this._read1GroupSearchText = '';
			};
			// clear currently selected write 1 group
			this.clearSelectedWrite1Group = function(){
				this.editDirModel.groupsForWriteCat1 = [];
				this.editDirModel.writeGroup1 = '';
				this._write1GroupSearchText = '';
			};
			// clear currently selected execute 1 group
			this.clearSelectedExecute1Group = function(){
				this.editDirModel.groupsForExecuteCat1 = [];
				this.editDirModel.executeGroup1 = '';
				this._execute1GroupSearchText = '';
			};				
			
			// set current read 1 groups to display
			this.setRead1Groups = function(groups){
				this.editDirModel.groupsForReadCat1 = groups;
			};
			// set current write 1 groups to display
			this.setWrite1Groups = function(groups){
				this.editDirModel.groupsForWriteCat1 = groups;
			};
			// set current execute 1 groups to display
			this.setExecute1Groups = function(groups){
				this.editDirModel.groupsForExecuteCat1 = groups;
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
				var results = query ? this.editDirModel.groupsForReadCat1.filter( this.createFilterFor(query) ) : this.editDirModel.groupsForReadCat1, deferred;
				return results;	
			};
			// returns a list of groups to display in the write group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.write1GroupSearch = function(query){
				var results = query ? this.editDirModel.groupsForWriteCat1.filter( this.createFilterFor(query) ) : this.editDirModel.groupsForWriteCat1, deferred;
				return results;	
			};
			// returns a list of groups to display in the execute group autocomplete box. this also filters the results
			// based on what the user types into the autocomplete box.
			this.execute1GroupSearch = function(query){
				var results = query ? this.editDirModel.groupsForExecuteCat1.filter( this.createFilterFor(query) ) : this.editDirModel.groupsForExecuteCat1, deferred;
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
				var categoryCode = this.editDirModel.readCat1.categoryCode;
				
				if(categoryCode === 'None'){ // 'None' value set in select box in edit_directory_content.jsp
					return;
				}
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
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
				var categoryCode = this.editDirModel.writeCat1.categoryCode;
				
				if(categoryCode === 'None'){ // 'None' value set in select box in edit_directory_content.jsp
					return;
				}				
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
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
				var categoryCode = this.editDirModel.executeCat1.categoryCode;
				
				if(categoryCode === 'None'){ // 'None' value set in select box in edit_directory_content.jsp
					return;
				}				
				
				homeRestService
					.fetchGatekeeperGroupsForCategory(categoryCode)
					.then( function ( jsonData ){
						 return jsonData;
					}, function( error ){
						alert('Error calling fetchGatekeeperCategories() service method' + JSON.stringify(error));
					
					//});
					})
					.then( function(data) {
						thisCtrl.setExecute1Groups(data);
					});
				
			};			

			this.cancelEdit = function(store, directoryResource){
				
				//$log.debug('cancel edit directory');
				
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
			
			/**
			 * store - current working store
			 * directoryResource - current working directory (not the one being edited)
			 */
			this.doEditDirectory = function(store, directoryResource){
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.dirForm.$valid){
					
					// call service to update directory, then reload path state
					homeRestService
						.updateDirectory(
								this.editDirModel.dirId, 
								this.editDirModel.dirName, 
								this.editDirModel.dirDescription, 
								this.editDirModel.readGroup1.groupCode, 
								this.editDirModel.writeGroup1.groupCode, 
								this.editDirModel.executeGroup1.groupCode)
						.then( function ( jsonData ){
							
							//$log.debug('completed updateDirectory service call');
							
							//$log.debug(JSON.stringify(jsonData))
							//return jsonData;
							thisCtrl.loadPathState(store, directoryResource);
							
						}, function( error ){
							alert('Error calling updateDirectory(...) service method' + JSON.stringify(error));
						});

					//this.loadPathState(store, directoryResource);
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}				
				
			};
			
		},
		
		controllerAs : 'dirCtrl' // default is $ctrl
		
	});	
	
})();	