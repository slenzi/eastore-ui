<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 0px;">

<md-progress-linear md-mode="determinate" value="{{pathCtrl.getProgressValue()}}" style="padding: 0px;" ></md-progress-linear>
	
	<section layout="row" layout-sm="row" layout-align="left left" layout-wrap>
	
		<md-menu md-offset="0 50">
			<md-button aria-label="Open Menu" class="md-icon-button" ng-click="pathCtrl.openMenu($mdMenu, $event)">
				<md-icon md-menu-origin md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_24px.svg"></md-icon>
			</md-button>
			<md-menu-content width="4" style="min-height: 350px;">
				
				<md-menu-item>
					<md-button ng-click="pathCtrl.loadStateUploadForm(pathCtrl.store, pathCtrl.directory)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg" md-menu-align-target></md-icon>
						Add Files
					</md-button>
				</md-menu-item>
				
				<md-menu-item>
					<md-button ng-click="pathCtrl.loadStateAddDirectoryForm(pathCtrl.store, pathCtrl.directory)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_add_24px.svg" md-menu-align-target></md-icon>
						Add Directory
					</md-button>
				</md-menu-item>	
				
				<md-menu-divider></md-menu-divider>
					
				<md-menu-item>
					<md-button ng-click="pathCtrl.cutSelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.getPathResources())" ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.getPathResources())">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_content_cut_24px.svg" md-menu-align-target></md-icon>
						Cut
					</md-button>
				</md-menu-item>

				<md-menu-item>
					<md-button ng-click="pathCtrl.copySelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.getPathResources())" ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.getPathResources())">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_content_copy_24px.svg" md-menu-align-target></md-icon>
						Copy
					</md-button>
				</md-menu-item>

				<md-menu-item>
					<md-button ng-click="pathCtrl.pasteItemsFromClipboard(pathCtrl.store, pathCtrl.directory)" ng-disabled="!pathCtrl.haveResourcesOnClipboard()"">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_content_paste_24px.svg" md-menu-align-target></md-icon>
						Paste
					</md-button>
				</md-menu-item>
				
				<md-menu-divider></md-menu-divider>
				
				<md-menu-item>
					<md-button ng-click="pathCtrl.deleteSelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.getPathResources())"  ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.getPathResources())">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_delete_24px.svg" md-menu-align-target></md-icon>
						Delete
					</md-button>
				</md-menu-item>
				
			</md-menu-content>
		</md-menu>	
		
		<div flex></div>	
		
		<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectPathResource(pathCtrl.getPathResources())"  ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.getPathResources())">
			Unselect
		</md-button>
		
	</section>	
	
	<!--
	current store
	current directory
	child resources for current directory
	click handler for clicking on resources
	click handler for editing resources
	-->
	<div smart-table-resource-list
		store="pathCtrl.store"
		directory="pathCtrl.directory"
		resource-list="pathCtrl.getPathResources()" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)"
		resource-edit-click-handler="pathCtrl.clickEditResourceHandler(theStore, theDirectory, thePathResource)">
	</div>
		
</md-content>