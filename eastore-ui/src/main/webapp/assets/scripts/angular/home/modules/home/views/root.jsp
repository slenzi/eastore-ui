<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%> 

<!--
<md-content layout="row" flex style="display: flex; flex-flow: row; height: 100%;">
-->

<div layout="row" style="height: 100%;" ng-controller="appController as appCtrl">

	<md-sidenav class="md-sidenav-left md-hue-1" md-component-id="{{rootCtrl.leftnavid}}" md-is-locked-open="$mdMedia('gt-md')">

		<!-- make sidenav header sticky-->
		<md-content layout="column" style="display: flex; flex-flow: column; height: 100%;">

			<md-toolbar class="md-tall md-hue-2" style="background-color: #fff; padding-top:35px;">
				<!--
				<span flex></span>
				-->
				<h3 class="md-toolbar-tools md-toolbar-tools-bottom">
					
					<a href="<%=request.getContextPath() %>">
						<img src="<spring:eval expression="@appProperties.getProperty('ecog.acrin.static.url')" />/public/css/ecog-acrin/1.0/images/ecog-acrin_logobanner.png" style="width:100%;"/>
					</a>
					<span flex></span>
					<!-- rootCtrl.toggleNav(rootCtrl.leftnavid) -->
					<md-button ng-click="appCtrl.toggleNav()" class="md-icon-button" aria-label="Menu" hide-gt-md>
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_18px.svg"></md-icon>
					</md-button>
					
				</h3>
			</md-toolbar>

			<md-content layout="column" class="md-hue-1" style="padding-top: 0px;">

				<ui-view name="uileftmenu"></ui-view>
				
			</md-content>
			
			<!-- flex background color to bottom of screen -->
			<md-content layout="column" class="md-hue-1" style="min-height: 3px;" flex>
			&nbsp;
			</md-content>
			
		</md-content>
		
	</md-sidenav>

	<!-- the 'style' values make sure we have a sticky header (header doesn't scroll out of view)-->
	<md-content flex style="display: flex; flex-flow: column; height: 100%;">

		<md-toolbar class="md-tall md-hue-0">
			<span flex></span>
			<div cycle>
				<img src="{{ img.src }}" width="100%" height="90" ng-repeat="img in rootCtrl.bannerImages" />
			</div>
			<h3 class="md-toolbar-tools md-toolbar-tools-bottom">
				<md-button ng-click="appCtrl.toggleNav()" class="md-icon-button" aria-label="Menu" hide-gt-md>
					<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_18px.svg"></md-icon>
				</md-button>				
				<span style="font-style: italic; whitespace:nowrap;">
				
					<ui-view name="uititle"></ui-view>
					
				</span>
				<div flex></div>
			</h3>
			<ui-view name="uiprogress"></ui-view>
		</md-toolbar>	
		
		<ui-view name="uiheader"></ui-view>
		
		<md-content layout="column">
		
			<growl-notifications></growl-notifications>
			
		    <div ng-repeat="task in rootCtrl.fileServiceTasksList">

		        <growl-notification ttl="-1">
		            {{task.message}}
		        </growl-notification>

		    </div>				
		
			<ui-view name="uicontent"></ui-view>
		
		</md-content>
		
	</md-content>

</div>
	
<!--
</md-content>
-->

