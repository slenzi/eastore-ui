(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule
	.service('resourceClipboardService', [
		'$log', ResourceClipboardService
		]
	);
	
	/**
	 * Service for storing resource data for clipboard (cut/cipy/paste) operations
	 */
	function ResourceClipboardService($log){		
		
		// *********************************
		// Internal methods and data
		// *********************************
		
		var operation;
		var sourceStore;
		var sourceDirectory;
		var clipboard = [];
		
		function _setOperation(op){
			$log.debug('setting clipboard operation to ' + op);
			operation = op;
		}
		
		function _getOperation(){
			return operation;
		}
		
		function _setSourceDirectory(directory){
			$log.debug('adding source directory to clipboard');
			sourceDirectory = directory;
		}

		function _getSourceDirectory(){
			return sourceDirectory;
		}		
		
		function _setSourceStore(store){
			$log.debug('adding source store to clipboard');
			sourceStore = store;
		}

		function _getSourceStore(){
			return sourceStore;
		}
		
		// add path resources to the clipboard
		function _setResources(resources){
			$log.debug('adding resources to clipboard');
			//for(var i = 0; i<resources.length; i++){
			//	clipboard.push(resources[i]);
			//}
			clipboard = [].concat(resources);
		}
		
		// get resources from clipboard
		function _getResources(){
				return clipboard;
		}
		
		// check if the clipboard has any resuorces
		function _haveResources(){
			return clipboard.length > 0 ? true : false;
		}
		
		// remove all resources from clipboard
		function _clear(){
			clipboard = [];			
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			setOperation : _setOperation,
			getOperation : _getOperation,
			
			setSourceDirectory : _setSourceDirectory,
			getSourceDirectory : _getSourceDirectory,
			
			setSourceStore : _setSourceStore,
			getSourceStore : _getSourceStore,
			
			setResources : _setResources,
			getResources : _getResources,
			haveResources : _haveResources,
			clear : _clear
			
		};
		
	}	
	
})();	