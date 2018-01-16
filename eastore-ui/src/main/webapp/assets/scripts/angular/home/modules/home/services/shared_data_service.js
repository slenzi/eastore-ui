(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule.factory('sharedDataService', [SharedDataService]);
	
	/**
	 * Service for sharing data between our various components/controllers
	 */
	function SharedDataService(){
		
		var _store;
		var _directory;
		var _pathResources;
		
		var _url;
		
		function _getUrl(){
			return _url;
		}
		function _setUrl(url){
			_url = url;
		}
		
		function _getStore(){
			return _store;
		}
		function _setStore(store){
			_store = store;
		}
		
		function _getDirectory(){
			return _directory;
		}
		function _setDirectory(directory){
			_directory = directory;
		}
		
		function _getPathResources(){
			return _pathResources;
		}		
		function _setPathResources(pathResources){
			_pathResources = pathResources;
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			getStore : _getStore,
			setStore : _setStore,
			
			getDirectory : _getDirectory,
			setDirectory : _setDirectory,
			
			getPathResources : _getPathResources,
			setPathResources : _setPathResources,
			
			setUrl : _setUrl,
			getUrl : _getUrl
			
		};		
		
	}	
	
})();