<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<md-content layout-padding >
	
		<div>
			<form name="storeForm">
			
				<div layout-gt-sm="row">
					<md-input-container class="md-block" flex-gt-sm>
					<label>Store Name (250 character max)</label>
					<input ng-model="storeCtrl.editStoreModel.storeName" md-maxlength="250" required>
					</md-input-container>
				</div>
				
				<md-input-container class="md-block">
					<label>Store Description (4,000 character max)</label>
					<textarea ng-model="storeCtrl.editStoreModel.storeDesc" md-maxlength="4000" rows="5" md-select-on-focus required></textarea>
				</md-input-container>
				
				<!-- Add ability to change store path at a later date. -->
				<div layout-gt-sm="row">
					<md-input-container class="md-block" flex-gt-sm>
					<label>Store Path (2,000 character max)</label>
					<input ng-model="storeCtrl.editStoreModel.storePath" md-maxlength="250" disabled>
					</md-input-container>
				</div>											
			
				<div layout-gt-sm="row">
					<md-input-container class="md-block" flex-gt-sm>
					<label>Root Directory Name (250 character max)</label>
					<input ng-model="storeCtrl.editStoreModel.rootDir.dirName" md-maxlength="250" required>
					</md-input-container>
				</div>
				
				<md-input-container class="md-block">
					<label>Root Directory Description (4,000 character max)</label>
					<textarea ng-model="storeCtrl.editStoreModel.rootDir.dirDescription" md-maxlength="4000" rows="5" md-select-on-focus required></textarea>
				</md-input-container>

				<md-card-content>
				<p>
				<ul>
					<li>Specify read, write, and execute, permissions for the directory.</li>
					<li>Permissions on child directories will be inherited from this directory, unless they override with their own permissions.</li>
					<li>File permissions are controlled by permissions set on directories.</li>
				</ul>
				<p>
				<br>
				</md-card-content>

				<md-card-content>
					<div layout="row">
						
						<!--
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
						-->
						
						<div layout="column">

							<md-input-container style="margin-right: 10px;">
								<label>Read Category</label>
								<md-select ng-model="storeCtrl.editStoreModel.rootDir.readCat1" ng-model-options="{trackBy: '$value.categoryId'}" ng-change="storeCtrl.read1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in storeCtrl.gatekeeperCategories" ng-value="cat">
										{{cat.categoryName}}
									</md-option>	
								</md-select>
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
								<label>Write Category</label>
								<md-select ng-model="storeCtrl.editStoreModel.rootDir.writeCat1" ng-model-options="{trackBy: '$value.categoryId'}" ng-change="storeCtrl.write1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in storeCtrl.gatekeeperCategories" ng-value="cat">
										{{cat.categoryName}}
									</md-option>	
								</md-select>
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
								<label>Execute Category</label>
								<md-select ng-model="storeCtrl.editStoreModel.rootDir.executeCat1" ng-model-options="{trackBy: '$value.categoryId'}" ng-change="storeCtrl.execute1CatChange()">
									<md-option><em>None</em></md-option>
									<md-option ng-repeat="cat in storeCtrl.gatekeeperCategories" ng-value="cat">
										{{cat.categoryName}}
									</md-option>	
								</md-select>
							</md-input-container>
							
						</div>

						<div layout="column">

							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="storeCtrl.isDisabled"
									  md-no-cache="storeCtrl.noCache"
									  md-selected-item="storeCtrl.editStoreModel.rootDir.readGroup1"
									  md-search-text-change="storeCtrl.read1GroupSearchTextChange(storeCtrl._read1GroupSearchText)"
									  md-search-text="storeCtrl._read1GroupSearchText"
									  md-selected-item-change="storeCtrl.read1GroupSelectedItemChange(group)"
									  md-items="group in storeCtrl.read1GroupSearch(storeCtrl._read1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Read Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="storeCtrl._read1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{storeCtrl._read1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
						
							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="storeCtrl.isDisabled"
									  md-no-cache="storeCtrl.noCache"
									  md-selected-item="storeCtrl.editStoreModel.rootDir.writeGroup1"
									  md-search-text-change="storeCtrl.write1GroupSearchTextChange(storeCtrl._write1GroupSearchText)"
									  md-search-text="storeCtrl._write1GroupSearchText"
									  md-selected-item-change="storeCtrl.write1GroupSelectedItemChange(group)"
									  md-items="group in storeCtrl.write1GroupSearch(storeCtrl._write1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Write Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="storeCtrl._write1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{storeCtrl._write1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
							
							<md-input-container style="margin-right: 10px;">
							
								  <md-autocomplete
									  ng-disabled="storeCtrl.isDisabled"
									  md-no-cache="storeCtrl.noCache"
									  md-selected-item="storeCtrl.editStoreModel.rootDir.executeGroup1"
									  md-search-text-change="storeCtrl.execute1GroupSearchTextChange(storeCtrl._execute1GroupSearchText)"
									  md-search-text="storeCtrl._execute1GroupSearchText"
									  md-selected-item-change="storeCtrl.execute1GroupSelectedItemChange(group)"
									  md-items="group in storeCtrl.execute1GroupSearch(storeCtrl._execute1GroupSearchText)"
									  md-item-text="group.groupName"
									  md-min-length="0"
									  placeholder="Execute Group" style="width: 400px;">
									<md-item-template>
									  <span md-highlight-text="storeCtrl._execute1GroupSearchText" md-highlight-flags="^i">{{group.groupName}}</span>
									</md-item-template>
									<md-not-found>
									  No groups matching "{{storeCtrl._execute1GroupSearchText}}" were found.
									</md-not-found>
								  </md-autocomplete>
							
							</md-input-container>
							
						</div>						
						
					</div>		
				</md-card-content>				
			
				<md-input-container class="md-block">
					<md-button class="md-raised standardButton" ng-click="storeCtrl.cancelEdit()">
					Cancel
					</md-button>				
					<md-button class="md-raised standardButton" ng-click="storeCtrl.doEditStore()">
					Submit
					</md-button>
				</md-input-container>
			
			</form>
			
		</div>	
		
	</md-content>	
	
</md-content>