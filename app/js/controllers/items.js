function ItemsController($scope, Items, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.editView = "views/item/edit.html"

  // profile
  $scope.profileShortcuts = $scope.profileShortcuts.concat([
    {class: "span9"}
    ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
  ])
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, unlist: true, hide: true},
    {name: "code", title: "商品编码", required: true},
    {name: "mnemonicCode", title: "商品助记码"},
    {name: "name", title: "商品名称", required: true},
    {name: "price", title: "单价", required: true},
    {name: "desc", title: "商品描述"},
    {name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'sale') {
        entity.fieldClass.status = "label label-success"
        return "正常"
      } else if(entity.status === 'removed') {
        entity.fieldClass.status = "label label-warning"
        return "下架"
      } else {
        return entity.status
      }
    }, hide:true, createHide: true},
    {name: "createdAt", title: "创建日期", createHide: true, hide: true},
    {name: "model", title: "型号"},
    {name: "updatedAt", title: "更新日期", createHide: true, unlist: true, hide: true}
  ]

  // route
  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
  }

  // bussiness
  $scope.resetPassword = function(entity) {
    entity.password = "654321"
    $scope.update(entity)
  }
  widthFunctions();

}
