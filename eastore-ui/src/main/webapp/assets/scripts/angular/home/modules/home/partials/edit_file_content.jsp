<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<md-content layout-padding >
	
		<div>
			<form name="fileForm">
			
				<div layout-gt-sm="row">
					<md-input-container class="md-block" flex-gt-sm>
					<label>File Name (250 character max)</label>
					<input ng-model="fileCtrl.editFileModel.fileName" md-maxlength="250" required>
					</md-input-container>
				</div>
				
				<md-input-container class="md-block">
					<label>File Description (4,000 character max)</label>
					<textarea ng-model="fileCtrl.editFileModel.fileDescription" md-maxlength="4000" rows="5" md-select-on-focus required></textarea>
				</md-input-container>				
			
				<md-input-container class="md-block">
					<md-button class="md-raised standardButton" ng-click="fileCtrl.cancelEdit(fileCtrl.store, fileCtrl.directory)">
					Cancel
					</md-button>				
					<md-button class="md-raised standardButton" ng-click="fileCtrl.doEditFile(fileCtrl.store, fileCtrl.directory)">
					Submit
					</md-button>
				</md-input-container>
			
			</form>
			
		</div>	
		
	</md-content>	
	
</md-content>