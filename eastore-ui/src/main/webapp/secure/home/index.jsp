<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%> 

<!DOCTYPE html>

<html lang="en" >
	
	<head>
	
    	<title>ECOG-ACRIN ProDoc</title>

	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="description" content="">
	    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />

		<jsp:include page="includes_header.jsp" />
	    
	    <!-- app resources -->
	    <link rel="stylesheet" href="<%=request.getContextPath()%>/secure/home/assets/css/app.css"/>	
	    
		<!-- for angular location provider -->
		<base href="/secure/home">	    
	    
	</head>

	<body ng-app="prodoc-home-app" layout="row" ng-controller="homeController as home">
	
	<md-sidenav class="md-sidenav-left md-hue-1" md-component-id="MyLeftNav" md-is-locked-open="$mdMedia('gt-md')">

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
					<md-button ng-click="home.toggleLeftNav()" class="md-icon-button" aria-label="Menu" hide-gt-md>
						<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_18px.svg"></md-icon>
					</md-button>
					
				</h3>
			</md-toolbar>

			<md-content layout="column" class="md-hue-1" style="padding-top: 0px;">
			
				<md-toolbar class="md-toolbar-tools md-hue-1">
				
					<!--&nbsp;Menu Header-->	
				
				</md-toolbar>

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
				<img src="{{ img.src }}" width="100%" height="90" ng-repeat="img in bannerImages" />
			</div>			
			<h3 class="md-toolbar-tools md-toolbar-tools-bottom">
				<md-button ng-click="home.toggleLeftNav()" class="md-icon-button" aria-label="Menu" hide-gt-md>
					<md-icon md-svg-icon="<%=request.getContextPath()%>/secure/home/assets/img/icons/ic_menu_18px.svg"></md-icon>
				</md-button>				
				<span style="font-style: italic; whitespace:nowrap;"> <ui-view name="uititle"></ui-view> </span>
				<div flex></div>
			</h3>
		</md-toolbar>	
		
		<ui-view name="uiheader"></ui-view>
		
		<md-content layout="column">
		
			<ui-view name="uicontent"></ui-view>
		
		</md-content>
		
	</md-content>

	<jsp:include page="includes_footer.jsp" />

  </body>
</html>