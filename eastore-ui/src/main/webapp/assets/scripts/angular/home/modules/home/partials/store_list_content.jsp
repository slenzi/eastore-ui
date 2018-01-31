<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<md-content layout-padding layout="column" class= id="reportContent" style="padding: 10px;">
	
	<p>
	List of all E-A Stores!
	</p>
	
	<div smart-table-store-list  store-list="storeCtrl.stores"
		store-click-handler="storeCtrl.clickStoreHandler(theStore)"
		store-edit-click-handler="storeCtrl.clickEditStoreHandler(theStore)"
		is-admin="storeCtrl.isAdminUser()"
		store-tree-view-click-handler="storeCtrl.showStoreTreeView(theStore)"></div>
		
</md-content>