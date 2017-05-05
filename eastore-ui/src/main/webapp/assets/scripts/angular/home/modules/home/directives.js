(function(){
	
	'use strict';
	
	// fetch main module
	var mainModule = angular.module('prodoc-main');
	
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
						return storeObj.dateCreated;
					}						
				}
			};
			
			$scope.viewStore = function(storeObj){
				$scope.storeClickHandler( {theStore: storeObj} );
			};
			
		}];
		
		// track by $index

		var template = 
			'<table st-table="storeListView" st-safe-src="storeListSafe" class="table mySmartTable">' +
			'	<thead>' +
			'	<tr>' +
			'        <th st-sort="tableGetters().getStoreName">Name</th>' +
			'        <th st-sort="tableGetters().getStoreDescription">Description</th>' +
			'        <th st-sort="tableGetters().getDateCreated">Created</th>' +		
			'	</tr>' +
			'	<tr>' +
			'		<th><input st-search="name" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="description" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="dateCreated" placeholder="search by date created" class="input-sm form-control" type="search"/></th>' +				
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="storeObj" st-select-mode="multiple" ng-repeat="storeObj in storeListView">' +	
			'        <td><a href ng-click=\"viewStore(storeObj);  $event.stopPropagation();\">{{storeObj.name}}</a></td>' +
			'        <td>{{storeObj.description}}</td>' +
			'        <td>{{storeObj.dateCreated}}</td>' +			
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="3" class="text-center">' +
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
	.directive('smartTableDirectoryList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
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
			
			$scope.viewChildResources = function(pathResObj){
				$scope.resourceClickHandler( {thePathResource: pathResObj} );
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
			'        <td><a href ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">{{pathResObj.nodeName}}</a></td>' +
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
				resourceList: '=',
				resourceClickHandler: '&'
			},
			controller: controller,
			template: template
		};
		
	}])
	.directive('smartTableFileList', ['$log', function($log) {
		
		var controller = ['$scope', function ($scope) {

			function init() {
				
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
					}					
				}
			};
			
			$scope.viewChildResources = function(pathResObj){
				$scope.resourceClickHandler( {thePathResource: pathResObj} );
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
			'	</tr>' +
			'	<tr>' +
			//'		<th></th>' +
			//'		<th><input st-search="nodeId" placeholder="search by node id" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="nodeName" placeholder="search by name" class="input-sm form-control" type="search"/></th>' +	
			'		<th><input st-search="desc" placeholder="search by description" class="input-sm form-control" type="search"/></th>' +
			'		<th><input st-search="mimeType" placeholder="search by type" class="input-sm form-control" type="search"/></th>' +
			'	</tr>' +			
			'	</thead>' +
			'	<tbody>' +
			'	<tr st-select-row="pathResObj" st-select-mode="multiple" ng-repeat="pathResObj in resourceListView" ng-if="pathResObj.resourceType === \'FILE\' ">' +
			//'		 <td><md-button class=\"md-raised\" ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">Download</md-button></td>' +		
			//'        <td>{{pathResObj.nodeId}}</td>' +
			'        <td><a href ng-click=\"viewChildResources(pathResObj);  $event.stopPropagation();\">{{pathResObj.nodeName}}</a></td>' +
			'        <td>{{pathResObj.desc}}</td>' +
			'        <td>{{pathResObj.mimeType}}</td>' +
			'	</tr>' +
			'	</tbody>' +
			'	<tfoot>' +
			'		<tr>' +		
			'			<td colspan="3" class="text-center">' +
			'				<div st-pagination="" st-items-by-page="20" st-displayed-pages="15"></div>' +
			'			</td>' +
			'		</tr>' +
			'	</tfoot>' +		
			'</table>';

		return {
			restrict: 'AE',
			scope: {
				resourceList: '=',
				resourceClickHandler: '&'
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