<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<!--
Resource store list partial that's loaded for the "state_home" state
-->
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">

	<!--Here is where we view directory path resource data...-->
	
	<span ng-if="pathCtrl.haveDirectoryResource(pathCtrl.pathresources)">
	<h3>Sub-Directories</h3>
	<div smart-table-directory-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>
	</span>

	<h3>Documents</h3>
	<div smart-table-file-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>
		
</md-content>