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
    {name: "sequenceNumber", title: "订单号"},
    {name: "type", title: "类型", value: function (entity) {
      if (entity.type == 'booking') {
        return '预订';
      } else if (entity.type == 'deliver') {
        return '外送';
      } else {
        return '';
      }
    }},
    {name: "memo", title: "备注", listHide: true, isArray:true},
    {name: "items", title: "商品", listHide: true, isArray:true},
    {name: "agent", title: "经手人", listHide: true, isObject: true},
    {name: "shop", title: "商店", listHide: true, isObject:true},
    {name: "customer", title: "顾客", isObject: true, value: function(entity) {
      return entity.customer.name;
    }},
    {name: "fee", title: "费用/元", value: function (entity) {
      return (entity.fee / 100).toFixed(2);
    }},
    {name: "quantity", title: "数量"},
    {name: "status", title: "状态", value: function (entity) {
      entity.fieldClass = entity.fieldClass || {}
      if (entity.status === 'placed') {
          entity.fieldClass.status = "label label-info"
          return '下单'
      } else if (entity.status === 'accepted') {
          entity.fieldClass.status = "label label-primary"
          return  '接受'
      } else if (entity.status === 'rejected') {
          entity.fieldClass.status = "label label-danger"
          return '退款'
      } else if (entity.status === 'executed') {
        entity.fieldClass.status = "label label-success"
        return '履行'
      } else if (entity.status === 'canceled') {
        entity.fieldClass.status = "label label-default"
        return '取消'
      } else {
        return ''
      }
    }},
    {name: "createdAt", title: "创建时间"}
  ];
  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/orders/profile.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.isBtnGroup = true; //
  $scope.btns = [
    {
      key:'placed',
      value:'下单'
    },
    {
      key:'accepted',
      value:'接受'
    },
    {
      key:'rejected',
      value:'拒绝'
    },
    {
      key:'executed',
      value:'履行'
    },
    {
      key:'canceled',
      value:'取消'
    }
  ];
  $scope.search = {};
  $scope.filter = function (key) {
    $scope.search.text = key;
    $timeout(function () {
      $scope.refreshList();
    }, 10)
  }
  $scope.isHide = true; //隐藏新增按钮
  $scope.params['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
  $scope.countQs['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
}