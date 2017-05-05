<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<!--
Resource store list partial that's loaded for the "state_home" state
-->
	
<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<p>
	This site provides access to protocol documents! Yay!
	</p>
	
	<div smart-table-prot-list  prot-list="protCtrl.prots"   prot-click-handler="protCtrl.clickProtHandler(theProt)"></div>
		
</md-content>