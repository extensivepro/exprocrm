function ShopsController($scope, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name', 'telephone']
  $scope.searchOptions.tooltip = "请输入商店名称或手机号码"

	$scope.editView ="views/shop/edit.html"
	
	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码", required: true, listHide: true, hide: true, createHide: true}
		,	{name: "name", title: "店名", required: true, hide: true, createHide: true}
    , {name: "merchantID", title: "商户ID", listHide:true, hide: true, isProfileHide: true, createHide: true}
		, {name: "address", title: "地址", required: true, hide: true, createHide: true}
		, {name: "telephone", title: "电话号码", hide: true, createHide: true}
		,	{name: "createdAt", title: "注册日期", readonly:true, createHide: true}
		,	{name: "closedAt", title: "关闭日期", listHide:true, readonly:true, createHide: true, isProfileHide: true}
    ,	{name: "updateAt", title: "更新日期", listHide:true, readonly:true, createHide: true, isProfileHide: true}
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
    $scope.entity.merchantID = $scope.currentMerchant.merchant.id;
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
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id; // find all shops that just belong to the currentMerchant
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  widthFunctions();
}