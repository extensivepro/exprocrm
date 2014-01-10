function ItemsController($scope, Items, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.editView = "views/merchant/edit.html"

  // profile
  $scope.profileShortcuts = $scope.profileShortcuts.concat([
    {class: "span9"}
    ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
  ])
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", unlist: true, hide: true},
    {name: "code", title: "商品编码"},
    {name: "mnemonicCode", title: "商品助记码"},
    {name: "name", title: "商品名称"},
    {name: "price", title: "单价"},
    {name: "desc", title: "商品描述"},
    {name: "status", title: "状态", value:function(entity){
      if(entity.status === 'sale') {
        this.class = "label label-success"
        return "正常"
      } else if(entity.status === 'removed') {
        this.class = "label label-warning"
        return "下架"
      } else {
        return entity.status
      }
    }, hide:true},
    {name: "createdAt", title: "创建日期", hide: true},
    {name: "model", title: "型号"},
    {name: "updatedAt", title: "更新日期", unlist: true, hide: true}
  ]

  // route
  $scope.showCreate = function() {
    $scope.showEdit({password: '123456'})
  }

  // bussiness
  $scope.resetPassword = function(entity) {
    entity.password = "654321"
    $scope.update(entity)
  }
  widthFunctions();

}
