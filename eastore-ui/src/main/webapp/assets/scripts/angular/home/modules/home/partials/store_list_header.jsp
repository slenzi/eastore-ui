<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>

<md-toolbar class="md-toolbar-tools md-hue-3 "> <!-- md-accent -->

	<div flex></div>
	
	<md-button class="" ng-click="storeCtrl.showCreateStoreForm()" aria-label="New Store">
		<md-tooltip md-direction="bottom">New Store</md-tooltip>
		<md-icon style="fill:white;" md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_circle_outline_24px.svg"></md-icon>
	</md-button>	
	
	<!--
	<md-button class="md-raised standardButton" ng-click="storeCtrl.showCreateStoreForm()">
		New Store
	</md-button>
	-->
	
	<!--
	<md-button class="md-fab ms-primary md-hue-1"  aria-label="Comment">
		<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_circle_outline_24px.svg" md-menu-align-target></md-icon>
	</md-button>
	-->
	
</md-toolbar>