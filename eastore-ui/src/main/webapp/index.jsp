<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
	
<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<html>

	<head>
	
		<title><spring:eval expression="@appProperties.getProperty('application.title')" /></title>
	
		<script type="text/javascript">
		window.location.href = "<%=request.getContextPath() %>/spring/private/main/home";
		</script>
		
	</head>
	
	<body>
	
		<p>
		Loading...
		</p>
		
	</body>

</html>