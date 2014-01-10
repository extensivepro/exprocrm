function ShopsController($scope, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name']
	$scope.editView ="views/shop/edit.html"
	
	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码"}
		,	{name: "name", title: "店名"}
    , {name: "merchantID", title: "业主ID"}
    ,	{name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'open') {
        entity.fieldClass.status = "label label-success"
        return "营业"
      } else if(entity.status === 'closed') {
        entity.fieldClass.status = "label label-warning"
        return "停业"
      } else {
        return "状态错误"
      }
    }, hide:true}
		, {name: "address", title: "地址"}
		, {name: "telephone", title: "电话"}
		,	{name: "createdAt", title: "注册日期", readonly:true}
		,	{name: "closedAt", title: "关闭日期", unlist:true, readonly:true}	
	]
	
	// bussiness
	$scope.setStatus = function(status) {
		$scope.entity.status = status
		$scope.update(true)
	}
  widthFunctions();
}