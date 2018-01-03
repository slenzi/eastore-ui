<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<md-toolbar class="md-toolbar-tools md-hue-3"> <!-- md-accent  md-toolbar-tools -->
	
	<span ng-repeat="resource in pathCtrl.breadcrumb">
		<span ng-if="$index > 0" class="md-subhead" style="color:white;">
			>&nbsp;
		</span>
		<span class="md-subhead">
			<a ng-click="pathCtrl.clickBreadcrumb(pathCtrl.store, resource)" style="color:white;">{{resource.nodeName}}</a>&nbsp;
		</span>
	</span>
	
	<div flex></div>
	
	<!--
	<md-progress-circular md-mode="indeterminate" md-diameter="40"></md-progress-circular>
	-->	
	
	<md-button class="" ng-click="pathCtrl.refreshPath(pathCtrl.store, pathCtrl.directory)" aria-label="Refresh View">
		<md-icon style="fill:white;" md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_refresh_24px.svg"></md-icon>
	</md-button>		
	
</md-toolbar>