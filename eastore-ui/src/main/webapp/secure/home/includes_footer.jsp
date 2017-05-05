<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
    
<!-- -------------------------------------------

third party scripts

--------------------------------------------- -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular/angular.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-touch/angular-touch.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-aria/angular-aria.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-ui-router/release/angular-ui-router.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-material/angular-material.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-smart-table/dist/smart-table.js"></script>

<!-- currently only needed for our cycling banner -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery-cycle2/build/jquery.cycle2.min.js"></script>

<!-- -------------------------------------------

application scripts

--------------------------------------------- -->

<!-- common -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/util/prodoc-util.js"></script>

<!-- specific to report app -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/modules.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/directives.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/controllers.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/app/app.js"></script>