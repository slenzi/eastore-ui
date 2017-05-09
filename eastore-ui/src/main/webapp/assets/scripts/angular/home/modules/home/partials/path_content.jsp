<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">

	<!--Here is where we view directory path resource data...-->
	
	<span ng-if="pathCtrl.haveDirectoryResource(pathCtrl.pathresources)">
	<h3>Sub-Directories</h3>
	<md-button class="md-raised standardButton" ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)">
		Add Directory
	</md-button>
	<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectDirectories(pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedDirectoryResource(pathCtrl.pathresources)">
		Unselect
	</md-button>
	<md-button class="md-raised standardButton" ng-click="pathCtrl.deleteSelectedDirectories(pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedDirectoryResource(pathCtrl.pathresources)">
		Delete
	</md-button>	
	<div smart-table-directory-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>
	</span>

	<h3>Files</h3>
	<section layout="row" layout-sm="row" layout-align="left left" layout-wrap>
		<md-button class="md-raised standardButton" ng-click="pathCtrl.loadStateUploadForm(pathCtrl.store, pathCtrl.directory)">
			Add Files
		</md-button>
		<md-button class="md-raised standardButton" ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)" ng-if="!pathCtrl.haveDirectoryResource(pathCtrl.pathresources) ">
			Add Directory
		</md-button>
		<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectFiles(pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedFileResource(pathCtrl.pathresources)">
			Unselect
		</md-button>
		<md-button class="md-raised standardButton" ng-click="pathCtrl.deleteSelectedFiles(pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedFileResource(pathCtrl.pathresources)">
			Delete
		</md-button>		
	</section>
	<div smart-table-file-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>
		
</md-content>