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
		
		controller : function($log, $state, $window, appConstants, homeRestService){				
			
			var thisCtrl = this;
			
            this.$onInit = function() {

                var isAuthWorldActive = (appConstants.authworldActive == 'true');

                $log.debug('AuthWorld Active? = ' + isAuthWorldActive);

                if(isAuthWorldActive){

                    $log.debug('Redirect URL? = ' + thisCtrl.redirectUrl);
                    $log.debug('Attempting to auto log in user...');

                    homeRestService.autoLoginAuthWorldUser().then(function (data){
                        thisCtrl.handleAutoLoginResponse(data);
                    });

                }

            };
			
            this.handleAutoLoginResponse = function(successful){

                $log.debug('successful => ' + successful);

                if(successful){
                    $log.debug('Auto login was a success! Redirect to resource.');
                    // redirect user to resource they were originally trying to access
                    $window.location.href = thisCtrl.redirectUrl;
                }else{
                    $log.debug('Auto login was NOT a success. Redirecting to authworld login page using handoff url.');
                    // redirect user to authworld login. AuthWorld will redirect them back
                    // to the resource they were originally trying to access after they log in.
                    var handOffUrl = homeRestService.buildAuthWorldHandOffUrl(thisCtrl.redirectUrl);
                    $window.location.href = handOffUrl;
                }


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
	
	/* no left nan bar on the login template
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
	*/
	
})();