(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	//
	// template for root view. this is the parent component which renders the side nav, and sets up
	// the child ui-view elements for all our other child states & components
	//
	mainModule.component('rootComponent', {
		
		bindings: {
			leftnavid : '<',
			haveUserInSession: '<'
			//,$transition$ : '<' // https://github.com/angular-ui/ui-router/issues/3110
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath + '/assets/scripts/angular/home/modules/home/views/root.jsp'
		},

		controller : function(appConstants, $log, $mdSidenav, $mdUtil, $location, $state, sharedDataService){
			
			var thisCtrl = this;
			
			this.$onInit = function() {
				
				$log.debug('rootComponent controller');
				
				$log.debug('Have AuthWorldUser in session? = ' + thisCtrl.haveUserInSession);
				if(!thisCtrl.haveUserInSession){
					var currentUrl = $location.absUrl();
					$log.debug('Current location = ' + currentUrl);
					sharedDataService.setUrl(currentUrl);
					$state.go('login');
				}
				
				// if no user in session then store current URL in shared data service, then
				// load the 'login' state where can attempt to log in the user using authworld
				// cookie data, or if need be redirect the user to the authworld login page.
				
			};
			
			this.leftNavComponentId = appConstants.leftNavComponentId;
			
			// banner images to cycle through
			this.bannerImages = new Array();
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
			this.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});			
			
			// for some reason this isn't working, so we setup a separate controller for opening/closing the nav
			// menu. see 'appController' in controllers.js
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
				//$log.debug('buildToggler for nav ' + navId);
				return $mdUtil.debounce(function(){
					//$log.debug('here');
					$mdSidenav(navId)
						.toggle()
						.then(function () {
							//$log.debug("toggle " + navId + " is done");
						});
				},300);
			};

			// close the nav bar with the specified id
			this.closeNav = function(navId) {
				//$log.debug('close nav ' + navId);
				$mdSidenav(navId).close()
				.then(function () {
					//$log.debug("close MyLeftNav is done");
				});
			};
					
		},
		
		controllerAs : 'rootCtrl' // default is $ctrl		
		
	});

})();