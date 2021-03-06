(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
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
		
		controller : function($log, $state, $scope, homeRestService, sharedDataService){
			
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
					
					sharedDataService.setProgressBarEnabled(true);
				
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
							
							sharedDataService.setProgressBarEnabled(false);
							
						}, function( error ){
							alert('Error calling addStore(...) service method' + JSON.stringify(error));
							sharedDataService.setProgressBarEnabled(false);
						})
						.then( function ( ){
							
							$state.go('stores');
							
						});						
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}
				
			};				
			
		},
		
		controllerAs : 'storeCtrl' // default is $ctrl
		
	});	
	
})();	