<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<p>
		<span style="font-weight: bold;">Drop Zone:</span> Drag-and-drop your files to the dotted box below, or use the 'Select Files' button above.<br>
		<div ea-upload-drop uploader="uploadCtrl.getUploader()" style="border: 1px solid #777; border-style: dashed; height: 200px;"></div>
	</p>
	
	<div ea-upload-progress uploader="uploadCtrl.getUploader()"></div>
	
    <!--
	<p>
		<div ea-upload-queue-simple uploader="uploadCtrl.getUploader()"></div>
	</p>
    -->	
	
	<div ea-upload-queue-table uploader="uploadCtrl.getUploader()"></div>
	
	<!--
	<p>
		Debug:<br>
		<div ea-upload-debug uploader="uploadCtrl.getUploader()"></div>
	</p>
	-->	
	
	<!-- hide input field. users use 'Select Files' button above -->
	<input id="file-input" style="display: none;" type="file" ea-upload-file-select uploader="uploadCtrl.getUploader()" multiple />
	
</md-content>