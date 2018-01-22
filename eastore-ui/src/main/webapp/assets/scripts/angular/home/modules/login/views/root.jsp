<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%> 

<!--
<md-content layout="row" flex style="display: flex; flex-flow: row; height: 100%;">
-->

<div layout="row" style="height: 100%;" ng-controller="appController as appCtrl">

	<!-- the 'style' values make sure we have a sticky header (header doesn't scroll out of view)-->
	<md-content flex style="display: flex; flex-flow: column; height: 100%;">

		<md-toolbar class="md-tall md-hue-0">
			<span flex></span>
			<div cycle>
				<img src="{{ img.src }}" width="100%" height="90" ng-repeat="img in rootCtrl.bannerImages" />
			</div>			
			<h3 class="md-toolbar-tools md-toolbar-tools-bottom">				
				<span style="font-style: italic; whitespace:nowrap;">
				
					<ui-view name="uititle"></ui-view>
					
				</span>
				<div flex></div>
			</h3>
		</md-toolbar>	
		
		<!--
		<ui-view name="uiheader"></ui-view>
		-->
		
		<md-content layout="column">
		
			<ui-view name="uicontent"></ui-view>
		
		</md-content>
		
	</md-content>

</div>
	
<!--
</md-content>
-->

