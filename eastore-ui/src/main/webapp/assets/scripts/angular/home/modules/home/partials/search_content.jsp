<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<md-content layout-padding layout="column" class= id="reportContent" style="padding: 0px;">
	
	<md-card md-theme-watch>
	
		<md-input-container>
			
			<!--
			<label>Store</label>
			-->
			
			<md-select style="background-color:#fff;" ng-model="searchCtrl.searchModel.selectedStore" ng-model-options="{trackBy: '$value.id'}" ng-change="searchCtrl.storeChange()">
				<md-option ng-repeat="store in searchCtrl.stores" ng-value="store">
					{{store.name}}
				</md-option>	
			</md-select>
			
		</md-input-container>
		
		<md-input-container>
		
			<label>Search Term</label>
			
			<input ng-model="searchCtrl.searchModel.searchText" ng-keyup="searchCtrl.handleSearch($event)">
		
		</md-input-container>		
	
	</md-card>
	
	<!--
	<md-card md-theme-watch ng-if="searchCtrl.searchModel.searchResults.length == 0 && searchCtrl.searchModel.searchText != '' ">
	No results for {{searchCtrl.searchModel.searchText}}
	</md-card>
	-->
	
	<md-card md-theme-watch ng-repeat="hit in searchCtrl.searchModel.searchResults">
		
		<span style="font-weight: bold;">
			{{ "#" + $index }} -
			<a href ng-click="searchCtrl.downloadFile(hit.resourceId)">{{hit.resourceName}}</a>
		</span>
		
		<br>
		
		<!--
		<span><b>Store:</b> {{hit.storeName}}</span>
		-->
		<!--
		<span><b>Full Path:</b> {{hit.resourceRelativePath}}</span>
		-->
		<!--
		<span><b>Directory:</b> {{hit.directoryName}}</span>
		-->
		
		<span>
			<b>Directory:</b> <a href ng-click="searchCtrl.loadDirectory(hit.storeName, hit.directoryRelativePath)" target="_blank">{{hit.directoryRelativePath}}</a>
			<hr>
		</span>
		
		<!--
		<span ng-repeat="fragment in hit.fragments | limitTo:2" ng-bind-html="fragment">
		-->
		<span ng-repeat="fragment in hit.fragments ">
			<i>{{fragment}}</i>
			<hr ng-if="$index < (hit.fragments.length) - 1">
		</span>
		
	</md-card>
		
</md-content>