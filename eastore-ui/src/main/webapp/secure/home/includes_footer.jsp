<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
    
<!-- -------------------------------------------

third party scripts

--------------------------------------------- -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular/angular.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-resource/angular-resource.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-touch/angular-touch.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-animate/angular-animate.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-aria/angular-aria.js"></script>

<!-- defacto standard for routing in angular js -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-ui-router/release/angular-ui-router.js"></script>

<!-- angular UI elements following Google's material UI guidlines -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-material/angular-material.js"></script>

<!-- angular smart table module -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-smart-table/dist/smart-table.js"></script>

<!-- stomp messaging over websockets using sockjs -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/sockjs-client/dist/sockjs.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/stomp-websocket/lib/stomp.js"></script>

<!-- currently only needed for our cycling banner -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery-cycle2/build/jquery.cycle2.min.js"></script>

<!-- -------------------------------------------

application scripts

--------------------------------------------- -->

<!-- common -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/util/eastore-ui-util.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/upload/ea-upload.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/websocket/ea-stomp.js"></script>

<!-- specific to report app -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/modules.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/directives.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/controllers.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/app/app.js"></script>