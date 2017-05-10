<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<p>
		<span style="font-weight: bold;">Drop Zone:</span> Drag-and-drop your files to the dotted box below, or use the 'Select Files' button below.<br>
		<div ea-upload-drop uploader="uploadCtrl.uploader" style="border: 1px solid #777; border-style: dashed; height: 200px;"></div>
	</p>
	
	<div ea-upload-progress uploader="uploadCtrl.uploader"></div>
	
    <!--
	<p>
		<div ea-upload-queue-simple uploader="uploadCtrl.uploader"></div>
	</p>
    -->	
	
	<section layout="row" layout-sm="row" layout-align="left left" layout-wrap>
		<label class="md-raised md-button" md-ink-ripple for="file-input">
			<span>Select Files</span>
		</label>
		<label class="md-raised md-button" md-ink-ripple ng-click="uploadCtrl.uploader.clearQueue()" ng-disabled="uploadCtrl.uploader.isQueueEmpty()">
			<span>Clear Files</span>
		</label>
		<label class="md-raised md-button" md-ink-ripple ng-click="uploadCtrl.startUpload(uploadCtrl.uploader, uploadCtrl.store, uploadCtrl.directory)" ng-disabled="uploadCtrl.uploader.isQueueEmpty()">
			<span>Start Upload</span>
		</label>		
	</section>
	
	<div ea-upload-queue-table uploader="uploadCtrl.uploader"></div>
	
	<!--
	<p>
		Debug:<br>
		<div ea-upload-debug uploader="uploadCtrl.uploader"></div>
	</p>
	-->
	
	<!-- hide input field. users use 'Select Files' button above -->
	<input id="file-input" style="display: none;" type="file" ea-upload-file-select uploader="uploadCtrl.uploader" multiple />
	
</md-content>