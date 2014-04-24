function MerchantsController($scope, Merchants, Pagination, $timeout, $injector,localStorageService){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.activeView = "views/merchant/profile.html"
  $scope.resource = Merchants
  $scope.searchOptions.fields = ['name', 'telephone']
  $scope.searchOptions.tooltip = "请输入商户名称"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "id", title: "商户ID", unlist: true, hide:true, createHide: true, isProfileHide:true}
    , {name: "owner", title: "商户业主", value:function(entity) {
      return entity.owner.displayName
    }, hide: true, createHide: true, unlist: true}
    , {name: "name", title: "商户简称", required: true, hide: true}
    , {name: "fullName", title: "商户全名", required: true, unlist: true, hide: true}
    , {name: "telephone", title: "电话", required: true}
    , {name: "email", title: "电子邮箱", unlist: true}
    , {name: "address", title: "地址", required: true}
    , {name: "zip", title: "邮编", unlist: true}
    , {name: "url", title: "商户网站", unlist: true}
    , {name: "createdAt", title: "创建日期", hide: true, createHide: true}
    , {name: "updateAt", title: "更新日期", unlist: true, hide: true, createHide: true, isProfileHide:true}
    , {name: "newestDeviceCode", title: "设备编码", hide: true, unlist: true, isProfileHide:true, createHide: true}
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

  $scope.profileShortcuts = [
      {class: "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-cog", text: "设置", op:"edit"}
  ];

  // route
  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
    $scope.activeView = "views/merchant/create.html"
  }

  $scope.create = function(entity) {
    entity["owner"] = $scope.me;
    var newOne = new $scope.resource(entity);
    console.log("#####"+JSON.stringify(newOne));
    newOne.$save(function(user) {
      console.log("success",user)
      Merchants.get({id:newOne.id}, function(merchant) {
        $scope.currentMerchant.merchant = merchant;
        $scope.allMerchant.push(merchant);
        $scope.activeView = "views/merchant/profile.html"
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

  $scope.editMerchant = function (entity) {
    $scope.entity = entity
    $scope.activeView = "views/merchant/edit.html"
  }

  $scope.cancelEdit = function () {
    $scope.activeView = "views/merchant/profile.html"
  }
  $scope.update = function (entity) {
    var resource = new $scope.resource(entity)
    resource.$update(function (err) {
      Merchants.query({id:entity.id}, function (merchant) {
        $scope.currentMerchant.merchant = merchant;
        $scope.activeView = "views/merchant/profile.html"
      })
    }, function (err) {
      console.log('update error:', err, entity)
    })
  }

  $scope.storageType = 'Local storage';
  if (localStorageService.getStorageType().indexOf('session') >= 0) {
    $scope.storageType = 'Session storage'
  }
  if (!localStorageService.isSupported) {
    $scope.storageType = 'Cookie';
  }
  $scope.local = {};
  $scope.$watch('local.cbx', function () {
    if ($scope.local.cbx===true) {
      localStorageService.set('localStorageCurrentMerchant',$scope.currentMerchant.merchant);
    }
  })
  $scope.defaultString = "name";
  $scope.trackListPage.activeView = 'views/merchant/profile.html';
  widthFunctions();
}