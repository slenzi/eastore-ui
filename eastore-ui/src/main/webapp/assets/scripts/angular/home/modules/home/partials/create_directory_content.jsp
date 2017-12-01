<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<md-content layout-padding >
	
		<div>
			<form name="dirForm">
			
				<div layout-gt-sm="row">
					<md-input-container class="md-block" flex-gt-sm>
					<label>Directory Name (250 character max)</label>
					<input ng-model="dirCtrl._newDir.dirName" md-maxlength="250" value="{{dirCtrl._newDir.dirName}}" required>
					</md-input-container>
				</div>
				
				<md-input-container class="md-block">
					<label>Directory Description (4,000 character max)</label>
					<textarea ng-model="dirCtrl._newDir.dirDescription" md-maxlength="4000" rows="5" md-select-on-focus required></textarea>
				</md-input-container>				
			
				<md-card-content>
					<div layout="row">
					
						<md-input-container style="margin-right: 10px;">
						<h5>Read Group</h5>
						</md-input-container>
						
						<md-input-container style="margin-right: 10px;">
							<label>Read Group Category</label>
							<md-select ng-model="dirCtrl._newDir.readCat1" ng-change="dirCtrl.read1CatChange()">
								<md-option><em>None</em></md-option>
								<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
									{{cat.categoryName}}
								</md-option>				
							</md-select>
						</md-input-container>
						
					</div>
				</md-card-content>

				<md-card-content>
					<div layout="row">
					
						<md-input-container style="margin-right: 10px;">
						<h5>Write Group</h5>
						</md-input-container>
						
						<md-input-container style="margin-right: 10px;">
							<label>Write Group Category</label>
							<md-select ng-model="dirCtrl._newDir.writeCat1" ng-change="dirCtrl.write1CatChange()">
								<md-option><em>None</em></md-option>
								<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
									{{cat.categoryName}}
								</md-option>				
							</md-select>
						</md-input-container>
						
					</div>
				</md-card-content>
				
				<md-card-content>
					<div layout="row">
					
						<md-input-container style="margin-right: 10px;">
						<h5>Execute Group</h5>
						</md-input-container>
						
						<md-input-container style="margin-right: 10px;">
							<label>Execute Group Category</label>
							<md-select ng-model="dirCtrl._newDir.executeCat1" ng-change="dirCtrl.execute1CatChange()">
								<md-option><em>None</em></md-option>
								<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
									{{cat.categoryName}}
								</md-option>				
							</md-select>
						</md-input-container>
						
					</div>
				</md-card-content>				
			
				<md-input-container class="md-block">
					<md-button class="md-raised standardButton" ng-click="dirCtrl.cancelCreate(dirCtrl.store, dirCtrl.directory)">
					Cancel
					</md-button>				
					<md-button class="md-raised standardButton" ng-click="dirCtrl.doCreateDirectory(dirCtrl.store, dirCtrl.directory)">
					Submit
					</md-button>
				</md-input-container>
			
			</form>
			
		</div>	
		
	</md-content>	
	
</md-content>