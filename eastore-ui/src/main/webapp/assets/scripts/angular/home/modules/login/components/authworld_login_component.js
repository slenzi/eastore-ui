(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-login');
	
	/* No need for header on login view
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
	*/
	
	mainModule.component('loginContentComponent', {
		
		bindings: {
			redirectUrl: '<'
		},
		
		templateUrl : function (appConstants){
			return appConstants.contextPath +  '/assets/scripts/angular/home/modules/login/partials/authworld_login_content.jsp';
		},			
		
		controller : function($log, $state, $window, appConstants, homeRestService){				
			
			var thisCtrl = this;
			
			//
			// On initialization, attempt to auto log in the user using authworld cookie data, provided authworld authentication is active.
			//
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
			
            //
            // process the auto login reponse from the server
            //
            this.handleAutoLoginResponse = function(successful){

                $log.debug('successful => ' + successful);

                if(successful){
                	// redirect user to resource they were originally trying to access
                    $log.debug('Auto login was a success! Redirect to resource.');
                    thisCtrl.handleRedirect(thisCtrl.redirectUrl);
                }else{
                    // redirect user to authworld login. AuthWorld will redirect them back
                    // to the resource they were originally trying to access after they log in.
                	$log.debug('Auto login was NOT a success. Redirecting to authworld login page using handoff url.');
                    homeRestService.buildAuthWorldHandOffUrl(thisCtrl.redirectUrl).then(function (data){
                    	thisCtrl.handleRedirect(data);
                    });
                }


            };
            
            //
            // Use $window.location.href to redirect the user to the url
            // 
            this.handleRedirect = function(url){
            	$window.location.href = url;
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
	
	/* no left nav bar on the login view
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