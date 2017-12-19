(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for edit file state
	//
	mainModule.component('editFileHeaderComponent', {
		
		bindings: {
			store : '<',
			directory : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_file_header.jsp';
		},			
		
		controller : function($log, $state){
			
			//$log.debug('editFileHeaderComponent controller');
			
			var thisCtrl = this;
			
			this.cancelEdit = function(store, directoryResource){
				
				$log.debug('cancel edit file');
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				
				
			};				
			
		},
		
		controllerAs : 'fileCtrl' // default is $ctrl
		
	});

	//
	// content for edit file state
	//
	mainModule.component('editFileContentComponent', {
		
		bindings: {
			store : '<',
			directory : '<',
			editFileModel : '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/home/partials/edit_file_content.jsp';
		},			
		
		controller : function($log, $state, $scope, homeRestService){
			
			//$log.debug('editFileContentComponent controller');
			
			var thisCtrl = this;
			
			this.cancelEdit = function(store, directoryResource){
				
				$log.debug('cancel edit file');
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});				
				
			};
			
			this.loadPathState = function(store, directoryResource){
				
				var newUrlPath = '/' + store.name + directoryResource.relativePath;
				
				$state.go('path', {
					urlPath: newUrlPath,
					store : store,
					currDirResource : directoryResource
					});
				
			};			

			this.doEditFile = function(store, directoryResource){
				
				// we put 'required' attribute on each of the input fields in the markup
				// the form will only be valid if values are entered into all field flag as required
				if($scope.fileForm.$valid){
					
					// call service to update file, then reload path state
					homeRestService
						.updateFile(
								this.editFileModel.fileId, 
								this.editFileModel.fileName, 
								this.editFileModel.fileDescription)
						.then( function ( jsonData ){
							
							$log.debug('completed updateFile service call');
							
							$log.debug(JSON.stringify(jsonData))
							//return jsonData;
							thisCtrl.loadPathState(store, directoryResource);
							
						}, function( error ){
							alert('Error calling updateFile(...) service method' + JSON.stringify(error));
						});
					
				}else{
					alert('Please fill out all required fields. Thank you.');
				}
				
			};	
			
		},
		
		controllerAs : 'fileCtrl' // default is $ctrl
		
	});	
	
})();	