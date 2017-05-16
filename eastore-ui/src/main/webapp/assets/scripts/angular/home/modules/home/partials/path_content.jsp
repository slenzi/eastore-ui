<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 5px;">
	
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
					<md-button ng-click="pathCtrl.cutSelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.pathresources)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_content_cut_24px.svg" md-menu-align-target></md-icon>
						Cut
					</md-button>
				</md-menu-item>

				<md-menu-item>
					<md-button ng-click="pathCtrl.copySelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.pathresources)" ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.pathresources)">
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
					<md-button ng-click="pathCtrl.deleteSelectedResources(pathCtrl.store, pathCtrl.directory, pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.pathresources)">
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_delete_24px.svg" md-menu-align-target></md-icon>
						Delete
					</md-button>
				</md-menu-item>
				
			</md-menu-content>
		</md-menu>	
		
		<div flex></div>
		
		<md-button class="md-raised standardButton" ng-click="pathCtrl.unselectPathResource(pathCtrl.pathresources)"  ng-disabled="!pathCtrl.haveSelectedPathResource(pathCtrl.pathresources)">
			Unselect
		</md-button>
		
	</section>	
	
	<div smart-table-resource-list
		store="pathCtrl.store"
		resource-list="pathCtrl.pathresources" 
		resource-click-handler="pathCtrl.clickResourceHandler(theStore, thePathResource)">
	</div>	
		
</md-content>