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
				<p>
				<ul>
					<li>Specify read, write, and execute, permissions for the directory.</li>
					<li>Permissions will be inherited from the parent directory if groups are left blank.</li>
					<li>File permissions are controlled by permissions set on the directory.</li>
				</ul>
				<p>
				<br>
				</md-card-content>

				<md-card-content>
					<div layout="row">
						
						<div layout="column">
						
							<md-input-container style="margin-right: 10px;">
							<h5>Read Permissions</h5>
							</md-input-container>
							
							<md-input-container style="margin-right: 10px;">
							<h5>Write Permissions</h5>
							</md-input-container>

							<md-input-container style="margin-right: 10px;">
							<h5>Execute Permissions</h5>
							</md-input-container>
							
						</div>
						
						<div layout="column">

							<md-input-container style="margin-right: 10px;">
								<label>Read Category</label>
								<md-select ng-model="dirCtrl._newDir.readCat1" ng-change="dirCtrl.read1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
										{{cat.categoryName}}
									</md-option>				
								</md-select>
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
								<label>Write Category</label>
								<md-select ng-model="dirCtrl._newDir.writeCat1" ng-change="dirCtrl.write1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
										{{cat.categoryName}}
									</md-option>				
								</md-select>
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
								<label>Execute Category</label>
								<md-select ng-model="dirCtrl._newDir.executeCat1" ng-change="dirCtrl.execute1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in dirCtrl.gatekeeperCategories" ng-value="cat.categoryCode">
										{{cat.categoryName}}
									</md-option>				
								</md-select>
							</md-input-container>
							
						</div>

						<div layout="column">

							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="dirCtrl.isDisabled"
									  md-no-cache="dirCtrl.noCache"
									  md-selected-item="dirCtrl._newDir.readGroup1"
									  md-search-text-change="dirCtrl.read1GroupSearchTextChange(dirCtrl._read1GroupSearchText)"
									  md-search-text="dirCtrl._read1GroupSearchText"
									  md-selected-item-change="dirCtrl.read1GroupSelectedItemChange(group)"
									  md-items="group in dirCtrl.read1GroupSearch(dirCtrl._read1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Read Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="dirCtrl._read1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{dirCtrl._read1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="dirCtrl.isDisabled"
									  md-no-cache="dirCtrl.noCache"
									  md-selected-item="dirCtrl._newDir.writeGroup1"
									  md-search-text-change="dirCtrl.write1GroupSearchTextChange(dirCtrl._write1GroupSearchText)"
									  md-search-text="dirCtrl._write1GroupSearchText"
									  md-selected-item-change="dirCtrl.write1GroupSelectedItemChange(group)"
									  md-items="group in dirCtrl.write1GroupSearch(dirCtrl._write1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Write Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="dirCtrl._write1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{dirCtrl._write1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
							
							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="dirCtrl.isDisabled"
									  md-no-cache="dirCtrl.noCache"
									  md-selected-item="dirCtrl._newDir.executeGroup1"
									  md-search-text-change="dirCtrl.execute1GroupSearchTextChange(dirCtrl._execute1GroupSearchText)"
									  md-search-text="dirCtrl._execute1GroupSearchText"
									  md-selected-item-change="dirCtrl.execute1GroupSelectedItemChange(group)"
									  md-items="group in dirCtrl.execute1GroupSearch(dirCtrl._execute1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Execute Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="dirCtrl._execute1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{dirCtrl._execute1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
							
						</div>						
						
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