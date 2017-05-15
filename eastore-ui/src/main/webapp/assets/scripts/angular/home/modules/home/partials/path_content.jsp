<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">

	<!--Here is where we view directory path resource data...-->
	
	<span ng-if="pathCtrl.haveDirectoryResource(pathCtrl.pathresources)">
	
		<h3>Sub-Directories</h3>
		
		<section layout="row" layout-sm="row" layout-align="left left" layout-wrap>
		
			<md-menu md-offset="0 50">
				<md-button aria-label="Open Menu" class="md-icon-button" ng-click="pathCtrl.openMenu($mdMenu, $event)">
					<md-icon md-menu-origin md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_24px.svg"></md-icon>
				</md-button>
				<md-menu-content width="4">
					<md-menu-item>
						<md-button ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)">
							<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg" md-menu-align-target></md-icon>
							Add Directory
						</md-button>
					</md-menu-item>
					<md-menu-divider></md-menu-divider>
					<md-menu-item>
						<md-button ng-click="pathCtrl.deleteSelectedDirectories(pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedDirectoryResource(pathCtrl.pathresources)">
							<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_delete_24px.svg" md-menu-align-target></md-icon>
							Delete
						</md-button>
					</md-menu-item>			
				</md-menu-content>
			</md-menu>	
			
			<div flex></div>
			
			<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectDirectories(pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedDirectoryResource(pathCtrl.pathresources)">
				Unselect
			</md-button>

		</section>
	
		<!--
		<md-button class="md-raised standardButton" ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)">
			Add Directory
		</md-button>
		<md-button class="md-raised standardButton" ng-click="pathCtrl.deleteSelectedDirectories(pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedDirectoryResource(pathCtrl.pathresources)">
			Delete
		</md-button>
		<md-button aria-label="comment" class="md-hue-2">
			<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg"></md-icon>
		</md-button>	
		<md-toolbar class="md-hue-1 md-accent">
		  <md-fab-actions class="md-toolbar-tools">
			<md-button aria-label="comment" class="md-hue-2">
			  <md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg"></md-icon>
			</md-button>
			<md-button aria-label="comment" class="md-fab md-hue-2">
			  <md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg"></md-icon>
			</md-button>		
		  </md-fab-actions>
		</md-toolbar>	
		-->
	
		<div smart-table-directory-list
			store="pathCtrl.store"
			resource-list="pathCtrl.pathresources" 
			resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
		</div>
		
	</span>

	<h3>Files</h3>
	
	<section layout="row" layout-sm="row" layout-align="left left" layout-wrap>
	
		<md-menu md-offset="0 50">
			<md-button aria-label="Open Menu" class="md-icon-button" ng-click="pathCtrl.openMenu($mdMenu, $event)">
				<md-icon md-menu-origin md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_24px.svg"></md-icon>
			</md-button>
			<md-menu-content width="4">
				<md-menu-item>
					<md-button ng-click="pathCtrl.loadStateUploadForm(pathCtrl.store, pathCtrl.directory)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg" md-menu-align-target></md-icon>
						Add Files
					</md-button>
				</md-menu-item>
				<md-menu-item ng-if="!pathCtrl.haveDirectoryResource(pathCtrl.pathresources) ">
					<md-button ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg" md-menu-align-target></md-icon>
						Add Directory
					</md-button>
				</md-menu-item>			
				<md-menu-divider></md-menu-divider>			
				<md-menu-item>
					<md-button ng-click="pathCtrl.deleteSelectedFiles(pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedFileResource(pathCtrl.pathresources)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_delete_24px.svg" md-menu-align-target></md-icon>
						Delete
					</md-button>
				</md-menu-item>			
			</md-menu-content>
		</md-menu>	
		
		<div flex></div>
		
		<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectFiles(pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedFileResource(pathCtrl.pathresources)">
			Unselect
		</md-button>
		
	</section>
	
	<!--
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
	-->
	
	<div smart-table-file-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>
		
</md-content>