<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<md-content layout-padding layout="column" class= id="reportContent" style="padding: 0px;">
	
	<md-card md-theme-watch>
	
		<md-input-container>
			
			<label>Store</label>
		
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
	
	<md-card md-theme-watch>

	Search results appear here...
	
	</md-card>
		
</md-content>