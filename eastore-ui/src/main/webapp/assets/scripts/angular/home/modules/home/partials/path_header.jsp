<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<!--
Toolbar partial that's loaded for the "state_home" state
-->

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
	
</md-toolbar>