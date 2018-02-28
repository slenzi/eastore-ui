<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<%-- used for accessing our spring managed properties --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
    
<!-- -------------------------------------------

third party scripts

--------------------------------------------- -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular/angular.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-resource/angular-resource.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-touch/angular-touch.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-animate/angular-animate.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-aria/angular-aria.min.js"></script>
<!-- needed? -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-messages/angular-messages.min.js"></script>

<!-- defacto standard for routing in angular js -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-ui-router/release/angular-ui-router.min.js"></script>

<!-- angular UI elements following Google's material UI guidlines -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-material/angular-material.min.js"></script>

<!-- Sanitizes an html string by stripping all potentially dangerous tokens -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-sanitize/angular-sanitize.min.js"></script>

<!-- angular smart table module -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/angular-smart-table/dist/smart-table.min.js"></script>

<!-- stomp messaging over websockets using sockjs -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/sockjs-client/dist/sockjs.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/stomp-websocket/lib/stomp.min.js"></script>

<!-- currently only needed for our cycling banner -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/jquery-cycle2/build/jquery.cycle2.min.js"></script>

<!-- date library -->
<!--
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/datejs/build/production/date.min.js"></script>
-->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/bower/moment/min/moment.min.js"></script>

<!-- -------------------------------------------

application scripts

--------------------------------------------- -->

<!-- common -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/util/eastore-ui-util.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/upload/ea-upload.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/common/modules/websocket/ea-stomp.js"></script>

<!-- login module -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/login/modules.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/login/components/root_login_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/login/components/authworld_login_component.js"></script>

<!-- main module -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/modules.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/directives.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/root_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/left_menu_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/search_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/title_header_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/store_list_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/create_store_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/path_resource_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/upload_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/create_directory_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/edit_directory_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/edit_file_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/edit_store_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/components/progress_component.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/controllers.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/home_service.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/shared_data_service.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/resolve_service.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/url_parse_service.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/resource_clipboard_service.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/modules/home/services/stomp_service.js"></script>

<!-- app bootstrap -->
<script type="text/javascript" src="<%=request.getContextPath()%>/assets/scripts/angular/home/app/app.js"></script>