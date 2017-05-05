(function(){

	angular
		.module('prodoc-main')
		.controller('homeController',[
			'appConstants', '$scope', '$state', '$stateParams', '$mdSidenav', '$mdUtil', '$log', HomeController
			]
		);
		
	//
	// Default controller which sets up rotating banner images, and left-hand navigation bar
	//
	function HomeController(
		appConstants, $scope, $state, $stateParams, $mdSidenav, $mdUtil, $log) {
   
   
		/****************************************************************************************
		 * Internal models bound to UI
		 */
		var _sectionTitle = "Not set";	
		
		// will be true when data is being loaded from server web service
		var _isLoadingDataFlag = false;	

		// banner images to cycle through
		$scope.bannerImages = new Array();
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna-test.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/dna strand.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/brain-scan.jpg"});
		$scope.bannerImages.push({ src: appConstants.applicationUrl + "/secure/home/assets/img/ecog/cancer cells.jpg"});        

		/****************************************************************************************
		 * On application load:  load all resource stores when page loads (asynchronously)
		 */		
		_handleOnPageLoad();

		function _handleOnPageLoad(){
			
			$log.debug('Loading index page');
			
		}
		
		/**
		 * Loads an angular-ui state, with the provided state parameters
		 */
		function _loadState(state, params){
			$state.go(state, params);
		}
		
		/**
		 * Builds a toggle switch for opening/closing navigation bar
		 */
		function _buildToggler(navID) {
			var debounceFn = $mdUtil.debounce(function(){
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					//$log.debug("toggle " + navID + " is done");
				});
			},300);
			return debounceFn;
		}
		
		/**
		 * Closes our left-hand navigation bar
		 */
		function _leftNavClose() {
			$mdSidenav('MyLeftNav').close()
			.then(function () {
				//$log.debug("close MyLeftNav is done");
			});
		};
	
		var self = this;
		
		/*
		 * External API
		 */
		return {
			
			toggleLeftNav : _buildToggler('MyLeftNav'),
			
			leftNavClose : _leftNavClose
			
		}

	}

})();