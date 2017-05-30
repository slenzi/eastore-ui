<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%> 

<!DOCTYPE html>

<html lang="en" >
	
	<head>
	
    	<title>ECOG-ACRIN Store UI</title>

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

	<body ng-app="eastore-ui-home-app">

		<ui-view name="rootview"></ui-view>

		<jsp:include page="includes_footer.jsp" />
	
	</body>
	
</html>