function ItemsController($scope, Items, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name', 'code']
  $scope.searchOptions.tooltip = "搜索商品名称或编码"
  $scope.editView = "views/item/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, unlist: true, hide: true},
    {name: "code", title: "商品编码", required: true},
    {name: "mnemonicCode", title: "商品助记码", unlist: true},
    {name: "name", title: "商品名称", required: true},
    {name: "model", title: "型号"},
    {name: "price", title: "售价", required: true, value:function(entity) {
    entity.fieldClass = entity.fieldClass || {}
    return (entity.price/100).toFixed(2)}},
    {name: "desc", title: "商品描述", unlist: true},
    {name: "createdAt", title: "创建日期", createHide: true, hide: true},
    {name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'sale') {
        entity.fieldClass.status = "label label-success"
        return "上架"
      } else if(entity.status === 'removed') {
        entity.fieldClass.status = "label label-warning"
        return "下架"
      } else {
        return entity.status
      }
    }, hide:true, createHide: true},
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
