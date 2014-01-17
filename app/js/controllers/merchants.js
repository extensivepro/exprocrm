function MerchantsController($scope, Merchants, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Merchants
  $scope.searchOptions.fields = ['name']
  $scope.editView = "views/merchant/edit.html"

  // profile
  $scope.profileShortcuts = $scope.profileShortcuts.concat([
    {class: "span9"}
    ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
  ])
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "id", title: "商户ID", unlist: true, hide:true, createHide: true}
    , {name: "owner", title: "商户业主", value:function(entity) {
      entity.fieldClass = entity.fieldClass || {}
      return entity.owner.displayName
    }, hide: true, createHide: true, unlist: true}
    , {name: "name", title: "商户名称", required: true, hide: true}
    , {name: "fullName", title: "商户全名", required: true, unlist: true, hide: true}
    , {name: "telephone", title: "电话", required: true}
    , {name: "email", title: "电子邮箱", unlist: true}
    , {name: "address", title: "地址", required: true}
    , {name: "zip", title: "邮编", required: true, unlist: true}
    , {name: "createdAt", title: "创建日期", hide: true, createHide: true}
    , {name: "updateAt", title: "更新日期", unlist: true, hide: true, createHide: true}
    , {name: "url", title: "商户网站", unlist: true}
    , {name: "newestDeviceCode", title: "设备编码", hide: true, unlist: true}
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
  ]

  // route
  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
  }

  $scope.create = function(entity) {
    entity["owner"] = $scope.me;
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