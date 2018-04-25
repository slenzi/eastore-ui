<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<html>

	<head>
	
		<title><spring:eval expression="@appProperties.getProperty('application.title')" /></title>
	
		<script type="text/javascript">
		// if you change /private/main/home the you also need to change it in search_component.js
		window.location.href = "<%=request.getContextPath() %>/private/main/home";
		</script>
		
	</head>
	
	<body>
	
		<p>
		Loading...
		</p>
		
	</body>

</html>