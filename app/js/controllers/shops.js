function ShopsController($scope, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name', 'telephone']
  $scope.searchOptions.tooltip = "请输入商店名称或手机号码"

	$scope.editView ="views/shop/edit.html"
	
	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码", required: true, listHide: true, hide: true}
		,	{name: "name", title: "店名", required: true, hide: true}
    , {name: "merchantID", title: "商户ID", listHide:true, hide: true, isProfileHide: true, createHide: true}
		, {name: "address", title: "地址", required: true, hide: true}
		, {name: "printers", title: "打印机", required: true, hide: true, listHide:true, createHide:true, value:function(entity){
      if (entity.printers) {
        return entity.printers;
      } else {
        return '尚未配置打印机';
      }
    }}
    , {name:"openRes", title:"开业资源", listHide:true, hide:true, createHide:true}
		, {name: "telephone", title: "电话号码", hide: true}
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
      Shops.get({id:newOne.id}, function(shop) {
        $scope.allShop.push(shop);
        console.log(shop)
      })
    },function(err){
      console.log('error:', err)
    })
  }
  // bussiness
  $scope.resetPassword = function(entity) {
    entity.password = "654321"
    $scope.update(entity)
  }
  $scope.update = function (entity) {
    var obj = entity;
    console.log('entity:\n', entity);
    var printers = entity.printers.split(',') || [];
    obj.printers = printers;
    var resource = new $scope.resource(obj);
    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update error:', err, entity)
    })
  };
  $scope.showProfile = function (entity) {
    if (entity.hasOwnProperty('printers')) {
      entity.printers = entity.printers.toString();
    } else {
      entity.printers = '';
    }
    $scope.entity = entity || $scope.entity;
    $scope.activeView = "views/shop/profile.html";
    $scope.trackListPage.activeView = '';
  }
  $scope.editAddRes = function () {
    var obj = {
      "name": "桌子",
      "type": "table",
      "serviceability": 1,
      "code": "16",
      "codename": "桌号"
    };
    $scope.entity.openRes = $scope.entity.openRes || [];
    $scope.entity.openRes.push(obj);
  };
  $scope.showCreate = function () {
    $scope.entityForCreate = {};
    $scope.activeView = "views/shop/create.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.create = function () {
    var obj = {
      code:$scope.entityForCreate.code,
      name:$scope.entityForCreate.name,
      address:$scope.entityForCreate.address,
      telephone: $scope.entityForCreate.telephone,
      merchantID:$scope.currentMerchant.merchant.id,
      status:'open',
      openRes:[],
      location:{},
      createdAt:Math.round(new Date().getTime() / 1000)
    }
    var newOne = new $scope.resource(obj);
    newOne.$save(function (result) {
      $scope.showList()
    }, function (err) {
      console.log('error:', err)
    })
  }
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id; // find all shops that just belong to the currentMerchant
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  widthFunctions();
}