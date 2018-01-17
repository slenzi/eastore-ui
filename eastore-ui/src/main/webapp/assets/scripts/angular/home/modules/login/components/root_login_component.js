(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-login');
	
	mainModule.component('rootLoginComponent', {
		
		bindings: { },
		
		templateUrl : function (appConstants){
			return appConstants.contextPath + '/assets/scripts/angular/home/modules/login/views/root.jsp'
		},

		controller : function(appConstants, $log, $mdSidenav, $mdUtil, $location, $state, sharedDataService){
			
			var thisCtrl = this;
			
			this.$onInit = function() {
				
				$log.debug('rootLoginComponent controller');
				
			};
			
			// banner images to cycle through
			this.bannerImages = new Array();
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});			
					
		},
		
		controllerAs : 'rootCtrl' // default is $ctrl		
		
	});

})();