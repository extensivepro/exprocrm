/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-19
 */
function OrdersController($scope, Orders, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Orders;
  $scope.searchOptions.fields = ['status']
  $scope.searchOptions.tooltip = "请输入订单状态"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "type", title: "类型", value: function (entity) {
      if (entity.type == 'booking') {
        return '预订';
      } else if (entity.type == 'deliver') {
        return '外送';
      } else {
        return '';
      }
    }},
    {name: "status", title: "状态", value: function (entity) {
      switch (entity.status) {
        case 'placed':return '下单';
        case 'accepted':return '接受';
        case 'rejected':return '拒绝';
        case 'executed':return '履行';
        case 'canceled':return '取消';
        default:return '';
      }
    }},
    {name: "memo", title: "备注", listHide: true, isArray:true},
    {name: "items", title: "商品", listHide: true, isArray:true},
    {name: "agent", title: "经手人", listHide: true, isObject: true},
    {name: "shop", title: "商店", listHide: true, isObject:true},
    {name: "customer", title: "顾客", listHide: true, isObject: true},
    {name: "fee", title: "费用", value: function (entity) {
      return (entity.fee / 100).toFixed(2);
    }},
    {name: "quantity", title: "数量"},
    {name: "sequenceNumber", title: "序列号", listHide: true},
    {name: "createdAt", title: "创建时间"}
  ];
  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/orders/profile.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.isHide = true; //隐藏新增按钮
  $scope.params['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
  $scope.countQs['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
}