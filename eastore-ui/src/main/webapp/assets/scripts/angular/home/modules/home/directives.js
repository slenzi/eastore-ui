(function(){
	
	'use strict';
	
	// fetch main module
	var mainModule = angular.module('eastore-ui-main');
	
	/**
	 * Handle single click when also using ng-dblclick. Allows for both
	 * single and double click on the same element.
	 * 
	 * Thanks to Rob:
	 * http://stackoverflow.com/questions/20444409/handling-ng-click-and-ng-dblclick-on-the-same-element-with-angularjs
	 */
	mainModule.directive('sglclick', ['$parse', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				var fn = $parse(attr['sglclick']);
				var delay = 300, clicks = 0, timer = null;
				element.on('click', function (event) {
					clicks++;  //count clicks
					if(clicks === 1) {
						timer = setTimeout(function() {
							scope.$apply(function () {
								fn(scope, { $event: event });
							}); 
							clicks = 0;             //after action performed, reset counter
						}, delay);
					} else {
						clearTimeout(timer);    //prevent single-click action
						clicks = 0;             //after action performed, reset counter
					}
				});
			}
		};
	}])
	//
	// directive for displaying a list of stores in a smart table 
	//
	.directive('smartTableStoreList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
				$scope.storeListSafe = $scope.storeList;
				// a separate list copy for display. this is needed for smart table
				$scope.storeListView = [].concat($scope.storeList);
				
				// update shipment list when storeList array changes
				$scope.$watch('storeList', function(newStoreList, oldStoreList){
					$scope.storeListSafe = newStoreList;
					$scope.storeListView = [].concat(newStoreList);
				}, true);				
				
			}

			init();

			$scope.tableGetters = function(){
				return {
					getStoreName: function (storeObj) {
						return storeObj.name;
					},
					getStoreDescription: function (storeObj) {
						return storeObj.description;
					},
					getDateCreated: function (storeObj) {
						var dateCreated = new Date(storeObj.dateCreated);
						return dateCreated.toString("MM/dd/yyyy hh:mm:ss tt");
					},
					getDateUpdated: function (storeObj) {
						var dateUpdated = new Date(storeObj.dateUpdated);
						return dateUpdated.toString("MM/dd/yyyy hh:mm:ss tt");
					}						
				}
			};
			
			$scope.viewStore = function(storeObj){
				$scope.storeClickHandler( {theStore: storeObj} );
			};
			
			$scope.editStore = function(storeObj){
				alert('Edit functionality coming soon!');
			};
			
		}];
		
		// track by $index

		var template = 
			'<table st-table="storeListView" st-safe-src="storeListSafe" class="table mySmartTable">' +
			'	<thead>' +
			'	<tr>' +
			'		 <th st-ratio="5">Menu</th>' +
			'        <th st-ratio="50" st-sort="tableGetters().getStoreName">Name</th>' +
			'        <th st-ratio="30" st-sort="tableGetters().getStoreDescription">Description</th>' +
			'        <th st-ratio="15" st-sort="tableGetters().getDateCreated">Created</th>' +
			'	</tr>' +
			'	<tr>' +
			'		<th></th>' +
			'		<th><input st-search="name" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="description" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="dateCreated" placeholder="search by date created" class="input-sm form-control" type="search"/></th>' +				
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="storeObj" st-select-mode="multiple" ng-repeat="storeObj in storeListView">' +	
			'        <td>' +
			'			<md-menu >' +
			'				<md-button aria-label="Open phone interactions menu" class="md-icon-button" ng-click="$mdOpenMenu(); $event.stopPropagation();">' +
			'					<md-icon md-menu-origin md-svg-icon="/eastore-ui/secure/home/assets/img/icons/ic_more_horiz_24px.svg" style="height: 20px;"></md-icon>' +
			'				</md-button>' +
			'				<md-menu-content width="3">' +
			'					<md-menu-item>' +
			'						<md-button ng-click="editStore(storeObj)">' +
			'							Edit Store' +
			'						</md-button>' +
			'					</md-menu-item>' +			
			'				</md-menu-content>' +		
			'			</md-menu>' +
			'        </td>' +			
			'        <td><a href ng-click=\"viewStore(storeObj);  $event.stopPropagation();\">{{storeObj.name}}</a></td>' +
			'        <td>{{storeObj.description}}</td>' +
			'        <td>{{tableGetters().getDateCreated(storeObj)}}</td>' +
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="4" class="text-center">' +
			'				<div st-pagination="" st-items-by-page="10" st-displayed-pages="15"></div>' +
			'			</td>' +
			'		</tr>' +
			'	</tfoot>' +		
			'</table>';

		return {
			restrict: 'AE',
			scope: {
				storeList: '=',
				storeClickHandler: '&'
			},
			controller: controller,
			template: template
		};
		
	}])
	//
	// directive for display directory path resources in a smart table
	// currently we aren't using this directive. We use smartTableResourceList.
	//
	/*
	.directive('smartTableDirectoryList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
				$scope.storeViewObj = $scope.store;
				$scope.$watch('store', function(newStore, oldStore){
					$scope.storeViewObj = newStore;
				}, true);				
				
				$scope.resourceListSafe = $scope.resourceList;
				// a separate list copy for display. this is needed for smart table
				$scope.resourceListView = [].concat($scope.resourceList);
				
				// update shipment list when resourceList array changes
				$scope.$watch('resourceList', function(newResourceList, oldResourceList){
					$scope.resourceListSafe = newResourceList;
					$scope.resourceListView = [].concat(newResourceList);
				}, true);				
				
			}

			init();

			$scope.tableGetters = function(){
				return {
					getNodeId: function (pathResObj) {
						return pathResObj.nodeId;
					},
					getNodeName: function (pathResObj) {
						return pathResObj.nodeName;
					},
					getDescription: function (pathResObj) {
						return pathResObj.desc;
					}					
				}
			};
			
			$scope.viewChildResources = function(storeObj, pathResObj){
				$scope.resourceClickHandler({
						theStore : storeObj,
						thePathResource: pathResObj
					});
			};
			
		}];
		
		// track by $index

		var template = 
			'<table st-table="resourceListView" st-safe-src="resourceListSafe" class="table mySmartTable">' +
			'	<thead>' +
			'	<tr>' +
			//'        <th>&nbsp;</th>' +
			//'        <th st-sort="tableGetters().getNodeId">ID</th>' +
			'        <th st-sort="tableGetters().getNodeName">Name</th>' +
			'        <th st-sort="tableGetters().getDescription">Description</th>' +	
			'	</tr>' +
			'	<tr>' +
			//'		<th></th>' +
			//'		<th><input st-search="nodeId" placeholder="search by node id" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="nodeName" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="desc" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +				
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="pathResObj" st-select-mode="multiple" ng-repeat="pathResObj in resourceListView" ng-if="pathResObj.resourceType === \'DIRECTORY\' ">' +
			//'		 <td><md-button class=\"md-raised\" ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">View Documents</md-button></td>' +		
			//'        <td>{{pathResObj.nodeId}}</td>' +
			'        <td><a href ng-click=\"viewChildResources(storeViewObj, pathResObj);  $event.stopPropagation();\">{{pathResObj.nodeName}}</a></td>' +
			'        <td>{{pathResObj.desc}}</td>' +	
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="2" class="text-center">' +
			'				<div st-pagination="" st-items-by-page="20" st-displayed-pages="15"></div>' +
			'			</td>' +
			'		</tr>' +
			'	</tfoot>' +		
			'</table>';

		return {
			restrict: 'AE',
			scope: {
				store: '=',
				resourceList: '=',
				resourceClickHandler: '&'
			},
			controller: controller,
			template: template
		};
		
	}])
	//
	// directive for display file meta path resources in a smart table
	// currently we aren't using this directive. We use smartTableResourceList.
	//
	.directive('smartTableFileList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
				$scope.storeViewObj = $scope.store;
				$scope.$watch('store', function(newStore, oldStore){
					$scope.storeViewObj = newStore;
				}, true);
				
				$scope.resourceListSafe = $scope.resourceList;
				// a separate list copy for display. this is needed for smart table
				$scope.resourceListView = [].concat($scope.resourceList);
				
				// update shipment list when resourceList array changes
				$scope.$watch('resourceList', function(newResourceList, oldResourceList){
					$scope.resourceListSafe = newResourceList;
					$scope.resourceListView = [].concat(newResourceList);
				}, true);				
				
			}

			init();

			$scope.tableGetters = function(){
				return {
					getNodeId: function (pathResObj) {
						return pathResObj.nodeId;
					},
					getNodeName: function (pathResObj) {
						return pathResObj.nodeName;
					},
					getDescription: function (pathResObj) {
						return pathResObj.desc;
					},
					getMimeType: function (pathResObj) {
						return pathResObj.mimeType;
					},
					getSize: function (pathResObj) {
						return pathResObj.fileSize;
					}
				}
			};
			
			$scope.viewChildResources = function(storeObj, pathResObj){
				$scope.resourceClickHandler({
						theStore : storeObj,
						thePathResource: pathResObj
					});
			};
			
			$scope.humanFileSize = function(bytes, si){
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
			};			
			
		}];
		
		// track by $index

		var template = 
			'<table st-table="resourceListView" st-safe-src="resourceListSafe" class="table mySmartTable">' +
			'	<thead>' +
			'	<tr>' +
			//'        <th>&nbsp;</th>' +
			//'        <th st-sort="tableGetters().getNodeId">ID</th>' +
			'        <th st-sort="tableGetters().getNodeName">Name</th>' +
			'        <th st-sort="tableGetters().getDescription">Description</th>' +
			'        <th st-sort="tableGetters().getMimeType">Type</th>' +
			'        <th st-sort="tableGetters().getSize">Size</th>' +
			'	</tr>' +
			'	<tr>' +
			//'		<th></th>' +
			//'		<th><input st-search="nodeId" placeholder="search by node id" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="nodeName" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="desc" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="mimeType" placeholder="search by type" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="fileSize" placeholder="search by size" class="input-sm form-control" type="search"/></th>' +
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="pathResObj" st-select-mode="multiple" ng-repeat="pathResObj in resourceListView" ng-if="pathResObj.resourceType === \'FILE\' ">' +
			//'		 <td><md-button class=\"md-raised\" ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">Download</md-button></td>' +		
			//'        <td>{{pathResObj.nodeId}}</td>' +
			'        <td><a href ng-click=\"viewChildResources(storeViewObj, pathResObj);  $event.stopPropagation();\">{{pathResObj.nodeName}}</a></td>' +
			'        <td>{{pathResObj.desc}}</td>' +
			'        <td>{{pathResObj.mimeType}}</td>' +
			'        <td>{{humanFileSize(pathResObj.fileSize, true)}}</td>' +
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="4" class="text-center">' +
			'				<div st-pagination="" st-items-by-page="20" st-displayed-pages="15"></div>' +
			'			</td>' +
			'		</tr>' +
			'	</tfoot>' +		
			'</table>';

		return {
			restrict: 'AE',
			scope: {
				store: '=',
				resourceList: '=',
				resourceClickHandler: '&'
			},
			controller: controller,
			template: template
		};
		
	}])
	*/
	//
	// directive for displaying path resources (both file meta and directory) in a smart table
	//
	.directive('smartTableResourceList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
				$scope.storeViewObj = $scope.store;
				$scope.$watch('store', function(newStore, oldStore){
					$scope.storeViewObj = newStore;
				}, true);
				
				$scope.directoryViewObj = $scope.directory;
				$scope.$watch('directory', function(newDirectory, oldDirectory){
					$scope.directoryViewObj = newDirectory;
				}, true);				
				
				$scope.resourceListSafe = $scope.resourceList;
				// a separate list copy for display. this is needed for smart table
				$scope.resourceListView = [].concat($scope.resourceList);
				
				// update shipment list when resourceList array changes
				$scope.$watch('resourceList', function(newResourceList, oldResourceList){
					$scope.resourceListSafe = newResourceList;
					$scope.resourceListView = [].concat(newResourceList);
				}, true);				
				
			}

			init();

			$scope.tableGetters = function(){
				return {
					getNodeId: function (pathResObj) {
						return pathResObj.nodeId;
					},
					getNodeName: function (pathResObj) {
						return pathResObj.nodeName;
					},
					getDescription: function (pathResObj) {
						return pathResObj.desc;
					},
					getMimeType: function (pathResObj) {
						return pathResObj.mimeType;
					},
					getSize: function (pathResObj) {
						return pathResObj.fileSize;
					},
					getPermissions: function(pathResObj){
						return $scope.getPermissionDetails(pathResObj);
					},
					getDateCreated: function (pathResObj) {
						var dateCreated = new Date(pathResObj.dateCreated);
						return dateCreated.toString("MM/dd/yyyy hh:mm:ss tt");
					},
					getDateUpdated: function (pathResObj) {
						var dateUpdated = new Date(pathResObj.dateUpdated);
						return dateUpdated.toString("MM/dd/yyyy hh:mm:ss tt");
					}
				}
			};
			
			/**
			  * click on a resource link (download file or view directory)
			  */
			$scope.viewChildResources = function(storeObj, pathResObj){
				$scope.resourceClickHandler({
						theStore : storeObj,
						thePathResource: pathResObj
					});
			};
			
			/**
			 *  click on edit directory menu item
			 *
			 *  storeObj - the current store
			 *  directoryObject - the current directory we are in
			 *  directoryToEdit - the child directory that the user wants to edit
			 */
			$scope.editDirectory = function(storeObj, directoryObject, directoryToEdit){
				$scope.resourceEditClickHandler({
						theStore : storeObj,
						theDirectory: directoryObject,
						thePathResource: directoryToEdit
					});
			};
			
			/**
			 * Check the canRead bit on the resource
			 */
			$scope.canReadPathResource = function(pathResource){
				//$log.debug(JSON.stringify(pathResource, null, 2));
				if(pathResource.canRead && pathResource.canRead === true){
					return true;
				}
				return false;
			};
			
			/**
			 * Check the canWrite bit on the resource
			 */
			$scope.canWritePathResource = function(pathResource){
				//$log.debug(JSON.stringify(pathResource, null, 2));
				if(pathResource.canWrite && pathResource.canWrite === true){
					return true;
				}
				return false;
			};

			/**
			 * Check the canExecute bit on the resource
			 */
			$scope.canExecutePathResource = function(pathResource){
				//$log.debug(JSON.stringify(pathResource, null, 2));
				if(pathResource.canExecute && pathResource.canExecute === true){
					return true;
				}
				return false;
			};

			/**
			 * Get permission string for the 'permission column in the table
			 */
			$scope.getPermissionDetails = function(pathResource){
				
				var permissionDetails = '';
				if(pathResource.canRead && pathResource.canRead === true){
					permissionDetails = permissionDetails + 'r';
				}
				if(pathResource.canWrite && pathResource.canWrite === true){
					permissionDetails = permissionDetails + 'w';
				}
				if(pathResource.canExecute && pathResource.canExecute === true){
					permissionDetails = permissionDetails + 'x';
				}				
				return permissionDetails;
				
			};			
			
			/** 
			 * Click on edit file menu item
			 *
			 *  storeObj - the current store
			 *  directoryObject - the current directory we are in
			 *  fileToEdit - the file that the user wants to edit
			 */
			$scope.editFile = function(storeObj, directoryObject, fileToEdit){
				$scope.resourceEditClickHandler({
						theStore : storeObj,
						theDirectory: directoryObject,
						thePathResource: fileToEdit
					});
			};			
			
			$scope.humanFileSize = function(bytes, si){
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
			};			
			
		}];
		
		// track by $index

		var template = 
			'<table st-table="resourceListView" st-safe-src="resourceListSafe" class="table mySmartTable">' +
			'	<thead>' +
			'	<tr>' +
			'		 <th st-ratio="5">Menu</th>' +
			//'     <th st-sort="tableGetters().getNodeId">ID</th>' +
			'        <th st-ratio="25" st-sort="tableGetters().getNodeName">Name</th>' +
			'        <th st-ratio="20" st-sort="tableGetters().getDescription">Description</th>' +
			'        <th st-ratio="20" st-sort="tableGetters().getPermissions">Permissions</th>' +
			'        <th st-ratio="10" st-sort="tableGetters().getMimeType">Type</th>' +
			'        <th st-ratio="10" st-sort="tableGetters().getSize">Size</th>' +
			'        <th st-ratio="10" st-sort="tableGetters().getDateUpdated">Updated Date</th>' +
			'	</tr>' +
			'	<tr>' +
			'		<th></th>' +
			//'		<th><input st-search="nodeId" placeholder="search by node id" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="nodeName" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="desc" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +
			'		<th></th>' +
			'		<th><input st-search="mimeType" placeholder="search by type" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="fileSize" placeholder="search by size" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="dateUpdated" placeholder="search by updated date" class="input-sm form-control" type="search"/></th>' +
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="pathResObj" st-select-mode="multiple" ng-repeat="pathResObj in resourceListView" >' +
			'        <td>' +
			'			<md-menu ng-if="pathResObj.resourceType === \'DIRECTORY\' && canExecutePathResource(pathResObj)">' +
			'				<md-button aria-label="Open phone interactions menu" class="md-icon-button" ng-click="$mdOpenMenu(); $event.stopPropagation();">' +
			'					<md-icon md-menu-origin md-svg-icon="/eastore-ui/secure/home/assets/img/icons/ic_more_horiz_24px.svg" style="height: 20px;"></md-icon>' +
			'				</md-button>' +
			'				<md-menu-content width="3">' +
			'					<md-menu-item>' +
			'						<md-button ng-click="editDirectory(storeViewObj, directoryViewObj, pathResObj)">' +
			'							Edit Directory' +
			'						</md-button>' +
			'					</md-menu-item>' +			
			'				</md-menu-content>' +		
			'			</md-menu>' +
			'			<md-menu ng-if="pathResObj.resourceType === \'FILE\'  && canExecutePathResource(pathResObj)">' +
			'				<md-button aria-label="Open phone interactions menu" class="md-icon-button" ng-click="$mdOpenMenu(); $event.stopPropagation();">' +
			'					<md-icon md-menu-origin md-svg-icon="/eastore-ui/secure/home/assets/img/icons/ic_more_horiz_24px.svg" style="height: 20px;"></md-icon>' +
			'				</md-button>' +
			'				<md-menu-content width="3">' +
			'					<md-menu-item>' +
			'						<md-button ng-click="editFile(storeViewObj, directoryViewObj, pathResObj)">' +
			'							Edit File' +
			'						</md-button>' +
			'					</md-menu-item>' +			
			'				</md-menu-content>' +		
			'			</md-menu>' +			
			'        </td>' +			
			//'		 <td><md-button class=\"md-raised\" ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">Download</md-button></td>' +		
			//'      <td>{{ pathResObj.nodeId }}</td>' +
			'        <td>' +
			'           <a href ng-click=\"viewChildResources(storeViewObj, pathResObj);  $event.stopPropagation();\" ng-if=\"canReadPathResource(pathResObj);\">{{ pathResObj.nodeName }}</a>' +
			'           <span ng-if=\"!canReadPathResource(pathResObj);\" ng-mouseover=\"pathResObj.showTip = true\">{{ pathResObj.nodeName }}<md-tooltip md-visible=\"pathResObj.showTip\" md-direction=\"right\">No read access</md-tooltip></span></a>' +
			'        </td>' +
			'        <td style="min-width: 200px;">{{ pathResObj.desc }}</td>' +
			'        <td>{{ getPermissionDetails(pathResObj) }}</td>' +
			'        <td>{{ pathResObj.resourceType === \'FILE\' ? pathResObj.mimeType : \'directory\' }}</td>' +
			'        <td style="white-space: nowrap;">{{ pathResObj.resourceType === \'FILE\' ? humanFileSize(pathResObj.fileSize, true) : \'\' }}</td>' +
			'        <td style="white-space: nowrap;">{{tableGetters().getDateUpdated(pathResObj)}}</td>' +
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="7" class="text-center">' +
			'				<div st-pagination="" st-items-by-page="20" st-displayed-pages="15"></div>' +
			'			</td>' +
			'		</tr>' +
			'	</tfoot>' +		
			'</table>';

		return {
			restrict: 'AE',
			scope: {
				store: '=',
				directory: '=',
				resourceList: '=',
				resourceClickHandler: '&',
				resourceEditClickHandler: '&'
			},
			controller: controller,
			template: template
		};
		
	}])	
	//
	// Cycle through banner images
	//
	.directive('cycle', function() {
		return {
			restrict: 'A',
			priority: 1001,
			link: function(scope, element, attrs) {
			   setTimeout(function(){
				   $(element).cycle({
					   fx: 'fade',
					   timeout: 10000
				   });
			   }, 0);
			}
		};
	});

})();