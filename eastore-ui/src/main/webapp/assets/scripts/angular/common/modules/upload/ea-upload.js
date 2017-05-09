/*
Angular HTTP upload module
-sal
*/

(function () {

	'use strict';

	var eaUploadModule;

	// create module
	eaUploadModule = angular.module('ea-upload-module', []);

	eaUploadModule.value('eaUploadOptions', {
		url: '/',                         // URL file data will be submitted to
		progress: 0,                      // Tracks progress for the upload. 0 = 0% and 100 = 100%
		method: 'POST',                   // HTTP method used to submit the upload
		formData: {},                     // Optional form data (key-value pairs) to be submitted along with the file data.
		files: [],                        // Tracks file to be uploaded. All files added to upload queue will be added to this object.
		headers: {},                      // Optional HTTP headers (currently not used.)
		smartTableFiles: []				  // For the angular smart table
	})
	// object for storing file data
	.factory('EAFileItem', ['$log', '$q',
	                               
	    function eaFileItemFactory($log, $q){
		
			function EAFileItem(fileData){
				
				// set defaults
				angular.extend(this, {
					name: 'name not set',  // Name of file being uploaded
                    progress: 0,           // Tracks progress for the upload. 0 = 0% and 100 = 100%
					files: []              // File being uploaded
				});
				
				if(fileData){
					this.setData(fileData);
				}
				
			};
			
			// extend functionality
			EAFileItem.prototype = {
				setData: function(fileData){
					angular.extend(this, fileData);
				},
				getName: function(){
					return this.name;
				},
				setName: function(name){
					this.name = name;
				},
				getFile: function(){
					return this.file;
				},
				setFile: function(file){
					this.file = file;
				},
				getHumanReadableSize: function(){
					return _humanFileSize(this.file.size,true);
				}
			};

			function _humanFileSize(bytes, si) {
				var thresh = si ? 1000 : 1024;
				if(Math.abs(bytes) < thresh) {
					return bytes + ' B';
				}
				var units = si
					? ['kB','MB','GB','TB','PB','EB','ZB','YB']
					: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
				var u = -1;
				do {
					bytes /= thresh;
					++u;
				} while(Math.abs(bytes) >= thresh && u < units.length - 1);
				return bytes.toFixed(1)+' '+units[u];
			}			
			
			// return this
			return EAFileItem;
		
		}
	                               
	])
	.factory('EAFileUploader', ['eaUploadOptions', 'EAFileItem', '$http', '$window', '$log',

	    /**
	     * Factory method which returns EAFileUploader object prototype.
	     */
	    function eaUploaderFactory(eaUploadOptions, EAFileItem, $http, $window, $log){

			/**
			 * Create instance of EAFileUploader from object prototype.
			 *
			 * @param {Object} [options]
			 * @constructor
			 */
			function EAFileUploader(options){
				
				var defaultOptions = angular.copy(eaUploadOptions);
				
				// extend this object with default options and user provided options
				angular.extend(this, defaultOptions, options);
				
			};		

			/**
			 * Produces a simple hello message.
			 *
			 * @returns {String}
			 */
			EAFileUploader.prototype.hello = function(){
				return 'Hello, use are using ' + this.constructor.name + '. Have a nice day.';
			};

			EAFileUploader.prototype.isHTML5 = !!($window.File && $window.FormData);
			
			/**
			 * Add form value to be submitted along with the file data
			 *
			 * @param key - the name of the form field
			 * @param value - the value of the form field
			 */
			EAFileUploader.prototype.addFormValue = function(key, value){
				
				$log.debug('adding form value, key = ' + key + ', value = ' + value);
				
				this.formData[key] = value;
				
			}
			
			/**
			 * Clear all form data / value
			 */
			EAFileUploader.prototype.clearFormValues = function(){
				
				this.formData = {};
				
			}			
			
			/**
			 * Add a file to the upload queue.
			 */
			EAFileUploader.prototype.addFile = function(fileToAdd){
				
				if(fileToAdd == null || fileToAdd.length == 0){
					return;
				}
				
				// create new file item
				var fileItem = new EAFileItem({
					name: fileToAdd.name,
					file: fileToAdd
				});
              
                //this.files[fileToAdd.name] = fileItem;
				this.files.push(fileItem);
				
				// copy files to smart table file array
				this.smartTableFiles = [].concat(this.files);
				
			};
			
			EAFileUploader.prototype.removeFile = function(eaFileItem){
			
				var fileIndex = 0;
				for(var i=0; i<this.files.length; i++){
					if(this.files[i].name == eaFileItem.name){
						fileIndex = i;
						break;
					}
				}
				if(fileIndex > -1){
					this.files.splice(fileIndex, 1);
					this.smartTableFiles = [].concat(this.files);
				}
			
			}
			
			/**
			 * Get all files in the queue
			 */
			EAFileUploader.prototype.getFilesInQueue = function(){
				return this.files;
			};
			
			/**
			 * Removes all files from the upload queue.
			 */
			EAFileUploader.prototype.clearQueue = function(){
				this.files = [];
				this.smartTableFiles = [];
			};
			
			/**
			 * Check if the upload queue is empty. Returns true if empty, false if not.
			 */
			EAFileUploader.prototype.isQueueEmpty = function(){
				//if( Object.keys(this.files).length == 0 ){
				//	return true;
				//}
				if(this.files.length == 0){
					return true;
				}
				return false;
			};			
			
			/**
			 * XML HTTP Request onProgress event handler
			 *
			 * uploader - the EAFileUploader that's performing the upload
			 * uploadProgressCallback - optional callback for upload progress event
			 * event - the progress event
			 */
			EAFileUploader.prototype.xhrOnProgress = function(uploader, uploadProgressCallback, event){
				
				var progressValue = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
				
				uploader.progress = progressValue;
				
				// call users progress callback if they provided one
				if(uploadProgressCallback && typeof uploadProgressCallback === 'function'){
					uploadProgressCallback(event);
				}
				
			};
            
			/**
			 * XML HTTP Request onProgress event handler, per file item
			 *
			 * uploader - the EAFileUploader that's performing the upload
             * eaFileItem - the file item that's currently being uploaded
			 * uploadProgressCallback - optional callback for upload progress event
			 * event - the progress event
			 */
			EAFileUploader.prototype.xhrOnProgressFileItem = function(uploader, eaFileItem, uploadProgressCallback, event){
				
				var progressValue = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
				
				uploader.progress = progressValue;
                
                eaFileItem.progress = progressValue;
				
				// call users progress callback if they provided one
				if(uploadProgressCallback && typeof uploadProgressCallback === 'function'){
					uploadProgressCallback(event);
				}
				
			};
			
			/**
			 * XML HTTP Request onLoad event handler
			 *
			 * uploadCompleteCallback - optional callback for upload complete event
			 */
			EAFileUploader.prototype.xhrOnLoad = function(uploader, uploadCompleteCallback, event){
				
				//uploader.clearQueue();
				
				// call users upload complete callback if they provided one
				if(uploadCompleteCallback && typeof uploadCompleteCallback === 'function'){
					uploadCompleteCallback(event);
				}				
				
			};

			/**
			 * XML HTTP Request onError event handler
			 */
			EAFileUploader.prototype.xhrOnError = function(event){
				$log.debug('An error occured while uploading the file data to the server.');
			};

			/**
			 * XML HTTP Request onAbort event handler
			 */
			EAFileUploader.prototype.xhrOnAbort = function(event){
				$log.debug('Upload has been canceled by the user.');
			};			
			
			/**
			 * Uploads all files in the queue, all in one single upload.
			 *
			 * uploadProgressCallback - optional callback for upload progress event
			 * uploadCompleteCallback - optional callback for upload complete event
			 */
			EAFileUploader.prototype.doUpload = function(uploadProgressCallback, uploadCompleteCallback){
				
				_doUploadAsGroup(this, uploadProgressCallback, uploadCompleteCallback);
                
			};
            
			/**
			 * Uploads all files in the queue, as separate individual uploads.
			 *
			 * uploadProgressCallback - optional callback for upload progress event
			 * individualUploadCompleteCallback - optional callback for upload complete event (for each file)
             * allUploadCompleteCallback - optional callback for once all files in the queue have be uploaded.
			 */
			EAFileUploader.prototype.doUploadSingular = function(uploadProgressCallback, individualUploadCompleteCallback, allUploadCompleteCallback){
				
				_doUploadSingular(this, uploadProgressCallback, individualUploadCompleteCallback, allUploadCompleteCallback);
                
			};
			
			/**
			 * Returns an object containing a bunch of functions for sorting data in our angular smart table (table that displays files in upload queue)
			 */
			EAFileUploader.prototype.uploadQueueTableGetters = function(){
				return {
					// sort by name
					fileName: function (eaFileItem) {
						return eaFileItem.name;
					},
					// sort by size
					fileSize: function(eaFileItem){
						return eaFileItem.file.size;
					}
				}
			};
            
            /**
             * Uploads all files in the queue as one single upload to the server.
             *
             * eaUploader - reference to the eaUploader object
			 * uploadProgressCallback - optional callback for upload progress event
			 * uploadCompleteCallback - optional callback for upload complete event             
             */
            function _doUploadAsGroup(eaUploader, uploadProgressCallback, uploadCompleteCallback){
                
                $log.debug('Uploading all files in queue as one single upload.');
                
                eaUploader.progress = 0;
				
				if(eaUploader.isQueueEmpty()){
					alert('There are no files in the upload queue. Try adding some files...');
					return;
				}
				
				var form = new FormData();
				var xhr = new XMLHttpRequest();
				
				// call this.xhrOnProgress for each progress update event. pass this (EAFileUploader)
				// plus uploadProgressCallback method (will be called if user provided one.)
				xhr.upload.addEventListener(
					"progress",
					angular.bind(null, eaUploader.xhrOnProgress, eaUploader, uploadProgressCallback),
					false
				);
				//xhr.upload.onprogress = eaUploader.xhrOnProgress;
				xhr.addEventListener(
					"load",
					angular.bind(null, eaUploader.xhrOnLoad, eaUploader, uploadCompleteCallback),
					false
				);
				//xhr.onload = eaUploader.xhrOnLoad;
				xhr.onerror = eaUploader.xhrOnError;
				xhr.onabort = eaUploader.xhrOnAbort;

				angular.forEach(eaUploader.files, function(eaFileItem, fileIndex) {
					form.append("file_" + fileIndex, eaFileItem.file);
				}, eaUploader);
			
				// append user form key-values
				var keyNames = Object.keys(eaUploader.formData);
				angular.forEach(keyNames, function(keyName, keyIndex) {
					var keyValue = eaUploader.formData[keyName];
					form.append(keyName, keyValue);
				}, eaUploader);				
			
				$log.debug('Submitting http ' + eaUploader.method + ' to ' + eaUploader.url);
				
				xhr.open(eaUploader.method, eaUploader.url);
				xhr.send(form);                
                
            }
            
            /**
             * Uploads all files in the queue, but each file is treated as a single/separate upload. (e.g., 5 files equals 5 uploads to the server.)
             *
             * eaUploader - reference to the eaUploader object
			 * uploadProgressCallback - optional callback for upload progress event
			 * individualUploadCompleteCallback - optional callback for upload complete event (for each file)
             * allUploadCompleteCallback - optional callback for once all fioles in the queue have be uploaded.            
             */
            function _doUploadSingular(eaUploader, uploadProgressCallback, individualUploadCompleteCallback, allUploadCompleteCallback){
                
                $log.debug('Uploading all files in queue as seperate, singular uploads.');
                
                eaUploader.progress = 0;
				
				if(eaUploader.isQueueEmpty()){
					alert('There are no files in the upload queue. Try adding some files...');
					return;
				}				
                
                var completeCallback = individualUploadCompleteCallback;
                
				angular.forEach(eaUploader.files, function(eaFileItem, fileIndex) {
                    
                    // use upload complete callback if last file
                    if(fileIndex == (eaUploader.files.length - 1)){
                        completeCallback = allUploadCompleteCallback;
                    }
                    
                    _doUploadFileItem(eaUploader, eaFileItem, uploadProgressCallback, completeCallback);
	
				}, eaUploader);
                
            }
            
            /**
             * Uploads the single eaFileItem to the server.
             *
             * eaUploader - reference to the eaUploader object
             * eaFileItem - file item model which contains reference the file data object
			 * uploadProgressCallback - optional callback for upload progress event
			 * uploadCompleteCallback - optional callback for upload complete event            
             */
            function _doUploadFileItem(eaUploader, eaFileItem, uploadProgressCallback, uploadCompleteCallback){
                
                eaUploader.progress = 0;
                
				var form = new FormData();
				var xhr = new XMLHttpRequest();
				
				// call this.xhrOnProgress for each progress update event. pass this (EAFileUploader)
				// plus the current eaFileItem being uploaded, and the uploadProgressCallback method (will be called if user provided one.)
				xhr.upload.addEventListener(
					"progress",
					angular.bind(null, eaUploader.xhrOnProgressFileItem, eaUploader, eaFileItem, uploadProgressCallback),
					false
				);
				//xhr.upload.onprogress = eaUploader.xhrOnProgress;
				xhr.addEventListener(
					"load",
					angular.bind(null, eaUploader.xhrOnLoad, eaUploader, uploadCompleteCallback),
					false
				);
				//xhr.onload = eaUploader.xhrOnLoad;
				xhr.onerror = eaUploader.xhrOnError;
				xhr.onabort = eaUploader.xhrOnAbort;
                
                // add file to form data
                form.append("file_0", eaFileItem.file);
                
				// append user form key-values
				var keyNames = Object.keys(eaUploader.formData);
				angular.forEach(keyNames, function(keyName, keyIndex) {
					var keyValue = eaUploader.formData[keyName];
					form.append(keyName, keyValue);
				}, eaUploader);
                
				$log.debug('Submitting http ' + eaUploader.method + ' to ' + eaUploader.url);
				
				xhr.open(eaUploader.method, eaUploader.url);
				xhr.send(form);                 
                
            }			

			// return object prototype
			return EAFileUploader;

		}
	])
	// directive which displays various debug information
	.directive('eaUploadDebug', ['$log', 'EAFileUploader', function($log, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			 */
			restrict: 'AE',
			replace: true,
			scope: {
				eaUploader: '=uploader'
			},
			// display all attributes of the uploader object in a bulleted list
			template: '<ul ng-repeat="(key, value) in eaUploader"><li><b>{{key}}</b> = {{value}}</li></ul>',
			link: function ($scope, element, attributes){
				$scope.$watch('eaUploader.progress', function(updatedUploader) {
					//$log.debug('eaUploader changed = ' + JSON.stringify(updatedUploader))
				});
			}
		};
	}])
	// directive which displays an angular material linear progress bar (requires Angular Material)
	.directive('eaUploadProgress', ['$log', 'EAFileUploader', function($log, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			 */
			restrict: 'AE',
			replace: true,
			scope: {
				eaUploader: '=uploader'
			},
			// must wrap md-progress-linear directive in a div
			// http://stackoverflow.com/questions/16148086/multiple-directives-directive1-directive2-asking-for-isolated-scope-on
			template:
				'<div>' +
                '   <md-progress-linear class="md-accent" md-mode="determinate" value="{{eaUploader.progress}}">' +
				'   </md-progress-linear>' +
				'</div>',
			link: function ($scope, element, attributes){

			}
		};
	}])
	// directive which displays all files added to the upload queue in a simple <ul><li></li></ul> list.
	.directive('eaUploadQueueSimple', ['$log', 'EAFileUploader', function($log, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			 */
			restrict: 'AE',
			replace: true,
			scope: {
				eaUploader: '=uploader'
			},
			template:
				'<ul ng-repeat="eaFileItem in eaUploader.files">' +
				'   <li>{{eaFileItem.name}} ({{eaFileItem.getHumanReadableSize()}})</li>' +
				'</ul>',
			link: function ($scope, element, attributes){

			}
		};
	}])
	// directive which displays all files added to the upload queue in a table (angular "smart-table" module)
	.directive('eaUploadQueueTable', ['$log', 'EAFileUploader', function($log, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			 */
			restrict: 'AE',
			replace: true,
			scope: {
				eaUploader: '=uploader'
			},
			template:
                '<table st-table="eaUploader.smartTableFiles" st-safe-src="eaUploader.files" class="table table-striped">' +
                '    <thead>' +
                '    <tr>' +
				'        <th></th>' +
                '        <th st-sort="eaUploader.uploadQueueTableGetters().fileName">Name</th>' +
                '        <th st-sort="eaUploader.uploadQueueTableGetters().fileSize">Size</th>' +
                '        <th>Progress Value</th>' +
                '        <th>Progress Bar</th>' +
                '    </tr>' +
                '    </thead>' +
                '    <tbody>' +
                '    <tr ng-repeat="eaFileItem in eaUploader.smartTableFiles">' +
				'        <td><a href ng-click="eaUploader.removeFile(eaFileItem)">[Remove]</a></td>' +
                '        <td>{{eaFileItem.name}}</td>' +
                '        <td>{{eaFileItem.getHumanReadableSize()}}</td>' +
                '        <td>' +
                '           {{eaFileItem.progress}}% ' +
                '        </td>' +
                '        <td>' +
				'           <div>' +
                '               <md-progress-linear class="md-accent" md-mode="determinate" value="{{eaFileItem.progress}}">' +
				'               </md-progress-linear>' +
				'           </div>' +
                '        </td>' +
                '    </tr>' +
                '    </tbody>' +
                '</table>',
			link: function ($scope, element, attributes){

				/*
				$scope.getters={
					fileName: function (eaFileItem) {
						//this will sort by the length of the first name string
						return eaFileItem.name.length;
					}
				}
				*/
			
			}
		};
	}])
	// directive for input type file (opens file select dialog)
	.directive('eaUploadFileSelect', ['$log','$parse','EAFileUploader', function($log, $parse, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			*/
			restrict: 'A',
			/*
			element - jQlite object
			*/
			link: function($scope, element, attributes) {

				var elm = element[0]; // convert angular jQlite element to raw DOM element

				// get reference to EAFileUploader object (from attribute field)
				var uploader = $scope.$eval(attributes.uploader);

				// make sure the object in the 'uploader' attribute is actually an instance of our EAFileUploader
				if (!(uploader instanceof EAFileUploader)) {
					throw new TypeError('Uploader must be an instance of EAFileUploader');
				}
				
				//$log.debug('typeof(element) = ' + typeof(element));
				//$log.debug('element.html() = ' + element.html());
				//$log.debug('elm.nodeName = ' + elm.nodeName);
				//$log.debug('attributes.uploader = ' + attributes.uploader);
				//$log.debug('Uploader is HTML 5 = ' + uploader.isHTML5);
				
				// angular has no built in support for binding to a file input.
				// https://github.com/angular/angular.js/issues/1375
				// http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields
				element.bind('change', function(event){
					var files = event.target.files;
					for(var i=0; i<files.length; i++){
						uploader.addFile(files[i]);
					}
					// update parent scope (will update the uploader binded to the eaUploadDebug directive)
					$scope.$parent.$apply();
				});
			}
		};
	}])
	.directive('eaUploadDrop', ['$log','$parse','EAFileUploader', function($log, $parse, EAFileUploader) {
		return {
			/*
			'A' - Attribute - <span ng-sparkline></span>
			'E' - Element   - <ng-sparkline></ng-sparkline>
			'C' - Class     - <span class="ng-sparkline"></span>
			'M' - Comments  - <!-- directive: ng-sparkline -->
			 */
			restrict: 'AE',
			link: function ($scope, element, attributes){
				
				var processDragOver, processDragEnter, processDragOverEnter, uploader;
				
				// get reference to EAFileUploader object (from attribute field)
				uploader = $scope.$eval(attributes.uploader);
				
				// make sure the object in the 'uploader' attribute is actually an instance of our EAFileUploader
				if (!(uploader instanceof EAFileUploader)) {
					throw new TypeError('Uploader must be an instance of EAFileUploader');
				}				
				
				processDragOver = function(event){
					processDragOverEnter(event);
				};
				
				processDragEnter = function(event){
					processDragOverEnter(event);
				};
				
				processDragOverEnter = function(event){
					if (event != null) {
						event.preventDefault();
					}
					//event.dataTransfer.effectAllowed = 'copy';
					return false;					
				}

				element.bind('dragover', processDragOver);
				element.bind('dragenter', processDragEnter);				
				
				return element.bind('drop', function(event) {
					
					var files, name, reader, size, type;
					
					$log.debug('Drop event');
					
					if (event != null) {
						//event.stopPropagation();
						event.preventDefault();
					}
					
					files = event.dataTransfer.files;
					
					var haveFolderSupport = isInputDirSupported();
					var unsupportedFolderDrop = false;
					
					for(var i=0; i<files.length; i++){
						//$log.debug('add file => [name=' + files[i].name + ', type=' + files[i].type + ', size=' + files[i].size + ']');
						
						if(isFolder(files[i])){
							if(haveFolderSupport){
								uploader.addFile(files[i]);
							}else{
								unsupportedFolderDrop = true;
							}
						}else{
							uploader.addFile(files[i]);
						}
						
					}
				
					// update parent scope (will update the uploader binded to the eaUploadDebug directive)
					$scope.$parent.$apply();

					if(unsupportedFolderDrop){
						alert('Sorry, drag-and-drop of folders is not supported by your browser. This feature works in Chrome.');
					}
					
					return false;
					
				});				
				
			}
		};		
	}]);
	
	/**
	 * Check if browser supports ability to select or drag-drop folders.
	 */
	function isInputDirSupported() {
		var tmpInput = document.createElement('input');
		if ('webkitdirectory' in tmpInput 
			|| 'mozdirectory' in tmpInput 
			|| 'odirectory' in tmpInput 
			|| 'msdirectory' in tmpInput 
			|| 'directory' in tmpInput) return true;

		return false;
	}
	
	/**
	 * Attempts to check if the file 'f' is a folder.
	 */
	function isFolder(f){
		if(f.size % 4096 == 0 && !f.type){
			return true;
		}else if(f.size % 4096 == 0 && getFileExtension(f.name) == ""){
			return true;
		} else if (getFileExtension(f.name) == ""){
			// only files with extensions are allowed
			return true;
		}
		return false;
	}	

	/**
	 * Get the file extension, or empty string if no period in name.
	 */
	function getFileExtension(name){
		var found = name.lastIndexOf(".") + 1;
		return ((found > 0) ? name.substr(found) : "");
	}	

	return eaUploadModule;

})();
