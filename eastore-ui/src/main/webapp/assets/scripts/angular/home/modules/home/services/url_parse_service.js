(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
	.service('urlParseService', [
		'appConstants', UrlParseService
		]
	);
	
	/**
	 * Service for parsing the 'urlPath' value from our angular-ui 'path' state.
	 */
	function UrlParseService($log){		
		
		// *********************************
		// Internal methods and data
		// *********************************
		
		//
		// Parse the storeName and relPath values from the urlPath
		// the urlPath should be /{storeName}/{relPath}
		//
		function _parseStoreAndRelpath(urlPath){
			
			if(urlPath.startsWith('/')){
				urlPath = urlPath.slice(1); // remove '/' from front
			}
			var _slashIndex = urlPath.indexOf('/');
			var _storeName = urlPath.substring(0, _slashIndex);
			var _relPath = urlPath.substring(_slashIndex);
			
			var data = {
				storeName : _storeName,
				relPath : _relPath
			};
			
			return data;
			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			parseStoreAndRelpath : _parseStoreAndRelpath
			
		};
		
	}	
	
})();	