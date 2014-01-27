function ShopsController($scope, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name']
	$scope.editView ="views/shop/edit.html"
	
	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码", required: true, unlist: true}
		,	{name: "name", title: "店名", required: true}
    , {name: "merchantID", title: "业主ID", unlist:true, hide: true}
		, {name: "address", title: "地址"}
		, {name: "telephone", title: "电话"}
		,	{name: "createdAt", title: "注册日期", readonly:true, createHide: true}
		,	{name: "closedAt", title: "关闭日期", unlist:true, readonly:true, createHide: true}
    ,	{name: "updateAt", title: "更新日期", unlist:true, readonly:true, createHide: true}
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
    }, hide:true, createHide: true}
  ]

  // route
  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
  }

  $scope.create = function(entity) {
    var newOne = new $scope.resource(entity);
    console.log("#####"+JSON.stringify(newOne));
    newOne.$save(function(user) {
      console.log("success",user)
      $scope.showList()
    },function(err){
      console.log('error:', err)
    })
  }
  // bussiness
  $scope.resetPassword = function(entity) {
    entity.password = "654321"
    $scope.update(entity)
  }
  widthFunctions();
}