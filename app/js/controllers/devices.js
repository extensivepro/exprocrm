function DevicesController($scope, Devices, Pagination, $modal, $timeout, $injector, $log, DeviceRegister){
	$injector.invoke(BasicController, this, {$scope: $scope})
  $scope.currentMerchant = {id: "c82e1197884d8806"}
	$scope.resource = Devices
  $scope.defaultParams = {"shop.merchant.id": $scope.currentMerchant.id}
	$scope.searchOptions.fields = ['code', 'name', 'udid']
  $scope.searchOptions.tooltip = "搜索编码、设备么、序列号"

	// profile 
	$scope.profileFields = [
    {name: "code", title: "编码", required: true}
		,	{name: "name", title: "设备名", required: true}
    , {name: "udid", title: "序列号", readonly:true}
		, {name: "shop.name", title: "所属店铺"}
		,	{name: "createdAt", title: "注册日期", readonly:true, createHide: true}
    ,	{name: "updateAt", title: "更新日期", unlist:true, readonly:true, createHide: true}
  ]

  // route
  $scope.showCreate = function() {
    var d = new Date()
    $scope.entity = {createdAt: Math.round(d.getTime()/1000)}
    $scope.registerOptions = {
      icon: "icon-pencil",
      alerts: []
    }
    $scope.registerFields = [
        {key: "udid", title: "设备的序列号", iPrepend:"icon-hdd", iStatus:"icon-asterisk"}
      , {key: "idcard", title: "设备的店长身份证", iPrepend:"icon-user", iStatus:"icon-asterisk"}
      , {key: "password", title: "设备的店长密码", iPrepend:"icon-key", iStatus:"icon-asterisk"}
    ]
    $scope.activeView = "views/devices/register.html"
  }
  
  // model
  $scope.validate = function (index) {
    var field = $scope.registerFields[index]
    $scope.registerOptions.alerts = []
    if(!$scope.entity[field.key] || $scope.entity[field.key] === '') {
      field.iStatus = "icon-remove-circle icon-large error"
      $scope.registerOptions.alerts.push({type:'danger', msg: field.title + "不能为空"})
    } else {
      field.iStatus = "icon-spinner icon-spin icon-large"
      if (field.key === 'udid') {
        Devices.query({udid:$scope.entity.udid}, function (devices) {
          if(devices.length > 0 ) {
            var device = devices[0]
            console.log(device, $scope.currentMerchant)
            if(device.shop && device.shop.merchant.id === $scope.currentMerchant.id) {
              field.iStatus = "icon-remove-circle icon-large error"
              $scope.registerOptions.alerts.push({type:'danger', msg: "您已经注册过该设备，不需要重复注册！"})
            } else {
              field.iStatus = "icon-ok-circle icon-large success"
              $scope.registerOptions.device = devices[0]
              $scope.entity.code = devices[0].code
              $scope.entity.name = devices[0].name
            }
          } else {
            field.iStatus = "icon-remove-circle icon-large error"
            $scope.registerOptions.alerts.push({type:'danger', msg: "系统没找到您提供的设备序列号，请确认输入是正确的序列号！"})
          }
        })
      } else if (field.key === 'idcard') {
        if($scope.entity.idcard.length === 18 || $scope.entity.idcard.length === 15) {
          field.iStatus = "icon-ok-circle icon-large success"
        } else {
          field.iStatus = "icon-remove-circle icon-large error"
          $scope.registerOptions.alerts.push({type:'danger', msg: "您提供的身份证位数不正确，请确认输入是正确的身份证号码！"})
        }
      } else if (field.key === 'password') {
        if($scope.entity.password.length === 6) {
          field.iStatus = "icon-ok-circle icon-large success"
        } else {
          field.iStatus = "icon-remove-circle icon-large error"
          $scope.registerOptions.alerts.push({type:'danger', msg: "店长的密码是长度为六位的数字，请重新输入正确密码!"})
        }
      }
    }
  }
  
  $scope.closeAlert = function(index) {
    $scope.registerOptions.alerts.splice(index, 1)
  }
  
  $scope.register = function () {
    $scope.registerOptions.alerts = []
    if (!$scope.entity.shop) {
      return $scope.registerOptions.alerts = [{type:'danger', msg: "请选择注册设备的归属商店！"}]
    }
    $scope.registerOptions.icon = "icon-spinner icon-spin"
    var device = {
      udid: $scope.entity.udid,
      code: $scope.entity.code,
      name: $scope.entity.name,
      originShop: {
        manager: {
          idcard: $scope.entity.idcard,
          password: $scope.entity.password
        }
      },
      registerShopID: $scope.entity.shop.id
    }
    DeviceRegister.save(device, function () {
      $scope.registerOptions.icon = "icon-pencil"
      $scope.registerOptions.alerts.push({type:'success', msg: "已经注册成功!"})
    }, function (err) {
      $scope.registerOptions.icon = "icon-pencil"
      $scope.registerOptions.alerts.push({type:'danger', msg: "注册失败，店长身份证和密码不正确!"})
    })
  }
  
  $scope.chooseShop = function () {
    var modalInstance = $modal.open({
      templateUrl: 'chooseShopModalContent.html',
      controller: ChooseShopModalInstanceCtrl,
      resolve: {
        shop: function () {
          return $scope.entity.shop;
        }
      }
    });

    modalInstance.result.then(function (selectedShop) {
      $scope.entity.shop = selectedShop;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}

var ChooseShopModalInstanceCtrl = function ($scope, Shops, $modalInstance, shop) {
  $scope.shops = []
  $scope.selected = {
    shop: shop
  }
  
  $scope.ok = function () {
    $modalInstance.close($scope.selected.shop);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  Shops.query({"merchantID": "c82e1197884d8806"}, function (shops) {
    $scope.shops = shops;
  })
};