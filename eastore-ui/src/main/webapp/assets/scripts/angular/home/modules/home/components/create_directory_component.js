(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
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
				
				//$log.debug('cancel create directory');
				
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
				
				if(categoryCode === 'None'){ // 'None' value set in select box in create_directory_content.jsp
					return;
				}				
				
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
				
				if(categoryCode === 'None'){ // 'None' value set in select box in create_directory_content.jsp
					return;
				}				
				
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
				
				if(categoryCode === 'None'){ // 'None' value set in select box in create_directory_content.jsp
					return;
				}				
				
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
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.dirForm.$valid){
					
					//alert('parentNodeId =' + directoryResource.nodeId + ', new dir name = ' + this._newDir.dirName + ', new dire desc = ' + this._newDir.dirDescription + ', read group = ' + this._newDir.readGroup1.groupCode + ', write group = ' + this._newDir.writeGroup1.groupCode + ', execute group = ' + this._newDir.executeGroup1.groupCode);
					
					// call service to create directory, then reload path state
					// addDirectory
					homeRestService
						.addDirectory(directoryResource.nodeId, this._newDir.dirName, this._newDir.dirDescription, this._newDir.readGroup1.groupCode, this._newDir.writeGroup1.groupCode, this._newDir.executeGroup1.groupCode)
						.then( function ( jsonData ){
							
							//$log.debug('completed addDirectory service call');
							
							//$log.debug(JSON.stringify(jsonData))
							//return jsonData;
							thisCtrl.loadPathState(store, directoryResource);
							
						}, function( error ){
							alert('Error calling addDirectory(...) service method' + JSON.stringify(error));
						});

					//this.loadPathState(store, directoryResource);
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}
				
			};

			this.cancelCreate = function(store, directoryResource){
				
				//$log.debug('cancel create directory');
				
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