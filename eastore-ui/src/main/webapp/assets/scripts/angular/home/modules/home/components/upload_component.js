(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// header for upload state
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
	// content for upload state
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
			
			//$log.debug('uploadContentComponent controller');
			
			//$log.debug(JSON.stringify($stateParams));
			
			this.startUpload = function(event, uploader, store, directoryResource){
				
				//$log.debug('store = ' + store.name + ', directory = ' + directoryResource.relativePath);
				
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
							//$log.debug('main progress = ' + progressValue);
							$scope.$apply();							
						},
						// callback for handling completion of single file upload event from eaUploader
						function (event){
							//$log.debug('Upload of single file complete.');
						},
						// callback for handling completion of all uploads event from eaUploader
						function(event){
							
							//$log.debug('Upload complete');
							
							var newUrlPath = '/' + store.name + directoryResource.relativePath;
							
							$state.go('path', {
								urlPath: newUrlPath,
								store : store,
								currDirResource : directoryResource
								});							
							
						}
					);
						
				}, function() {
					
					//$log.debug('Uploade operation canceled.');
					
				});				
				
			};
			
		},
		
		controllerAs : 'uploadCtrl' // default is $ctrl
		
	});	
	
})();	