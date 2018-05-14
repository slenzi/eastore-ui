(function(){
	
	'use strict';
	
	var mainModule = angular.module('eastore-ui-main');
	
	mainModule.factory('sharedDataService', ['$log', SharedDataService]);
	
	/**
	 * Service for sharing data between our various components/controllers
	 */
	function SharedDataService($log){
		
		// id of logged in user
		var _userId;
		
		// current working store, directory
		var _store;
		var _directory;
		
		// current lsit of child path resources for the current working directory
		var _pathResources;
		
		// keep track of current url, used during login (might need to redirect user back after authentication)
		var _url;
		
		// for progress bar in uipogress template
		var _progressBarStyle = 'indeterminate';
		var _progressBarValue = 100; // only applicable if progress style is 'determinate'
		var _progressBarEnabled = false;
		
		//var fileServiceTasks = []; 
		//fileServiceTasks['-1'] = {  id: '-1', message: 'hello eastore!' };
		var fileServiceTasks = {};
		
		function _getUserId(){
			return _userId;
		}
		function _setUserId(userId){
			_userId = userId;
		}
		
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
		
		function _getProgressBarStyle(){
			return _progressBarStyle;
		}
		function _getProgressBarValue(){
			return _progressBarValue;
		}
		function _isProgressBarEnabled(){
			return _progressBarEnabled;
		}
		function _setProgressBarStyle(style){
			_progressBarStyle = style;
		}
		function _setProgressBarValue(value){
			_progressBarValue = value;
		}
		function _setProgressBarEnabled(isEnabled){
			//$log.debug('progress Bar Enabled = ' + isEnabled);
			_progressBarEnabled = isEnabled;
		}
		
		// add and track a file service task received from websocket connection
		function _addFileServiceTask(task){
			
			/*
			if(fileServiceTasks.hasOwnProperty(task.id)){
				$log.debug('updating tracking data for file service task: ' + JSON.stringify(task, null, 2));
				fileServiceTasks[task.id].progress = task.progress;
				fileServiceTasks[task.id].message = task.message;
			}else{
				$log.debug('tracking new file service task: ' + JSON.stringify(task, null, 2));
				fileServiceTasks[task.id] = task;				
			}
			*/
			
			$log.debug('tracking file service task: ' + JSON.stringify(task, null, 2));
			fileServiceTasks[task.id] = task;
			
		}
		
		// remove and untrack a file service task
		function _removeFileServiceTask(task){
			$log.debug('untracking file service task: ' + JSON.stringify(task, null, 2));
			delete fileServiceTasks[task.id];
		}
		
		function _fileServiceTasks(){
			return fileServiceTasks;
		}
		
		// *********************************
		// External API
		// *********************************
		return {
			
			getUserId : _getUserId,
			setUserId : _setUserId,			
			
			getStore : _getStore,
			setStore : _setStore,
			
			getDirectory : _getDirectory,
			setDirectory : _setDirectory,
			
			getPathResources : _getPathResources,
			setPathResources : _setPathResources,
			
			setUrl : _setUrl,
			getUrl : _getUrl,
			
			getProgressBarStyle : _getProgressBarStyle,
			getProgressBarValue : _getProgressBarValue,
			isProgressBarEnabled : _isProgressBarEnabled,
			setProgressBarStyle : _setProgressBarStyle,
			setProgressBarValue : _setProgressBarValue,
			setProgressBarEnabled : _setProgressBarEnabled,
			
			addFileServiceTask : _addFileServiceTask,
			removeFileServiceTask : _removeFileServiceTask,
			fileServiceTasks : _fileServiceTasks
			
		};		
		
	}	
	
})();