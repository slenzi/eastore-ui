(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-login');
	
	mainModule.component('loginHeaderComponent', {
		
		bindings: {

		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/login/partials/authworld_login_header.jsp';
		},			
		
		controller : function($log, $state){				
			
		},
		
		controllerAs : 'loginCtrl' // default is $ctrl
		
	});
	
	mainModule.component('loginContentComponent', {
		
		bindings: {
			redirectUrl: '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/login/partials/authworld_login_content.jsp';
		},			
		
		controller : function($log, $state){				
			
			var thisCtrl = this;
			
			this.$onInit = function() {
				
				$log.debug('Redirect URL? = ' + thisCtrl.redirectUrl);
				
			};
			
		},
		
		controllerAs : 'loginCtrl' // default is $ctrl
		
	});
	
	mainModule.component('loginTitleComponent', {
		
		bindings: { headerTitle: '<' },
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/login/partials/authworld_login_title.jsp';
		},			
		
		controller : function($log, $state){				
			
		},
		
		controllerAs : 'loginCtrl' // default is $ctrl
		
	});
	
	mainModule.component('loginLeftMenuComponent', {
		
		bindings: {

		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/login/partials/authworld_login_left_menu.jsp';
		},			
		
		controller : function($log, $state){				
			
		},
		
		controllerAs : 'loginCtrl' // default is $ctrl
		
	});	
	
})();