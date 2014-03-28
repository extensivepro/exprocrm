function ItemsController($scope, Items, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.searchOptions.tooltip = "请输入商品名称"
  $scope.editView = "views/item/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, listHide: true, hide: true, isProfileHide:true, createHide: true},
    {name: "code", title: "商品编码", required: true, hide: true},
    {name: "name", title: "商品名", required: true},

    {name: "model", title: "型号"},
    {name: "mnemonicCode", title: "助记码", unlist: true},
    {name: "price", title: "售价", required: true, value:function(entity) {
    entity.fieldClass = entity.fieldClass || {}
    return (entity.price/100).toFixed(2)}},
    {name: "desc", title: "商品描述", listHide: true},
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
    {name: "updatedAt", title: "更新日期", createHide: true, listHide: true, hide: true, isProfileHide:true}
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
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.defaultString = "name";
  widthFunctions();

}
