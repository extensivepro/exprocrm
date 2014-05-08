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
          return '已下单'
      } else if (entity.status === 'accepted') {
          entity.fieldClass.status = "label label-primary"
          return  '已接受'
      } else if (entity.status === 'rejected') {
          entity.fieldClass.status = "label label-danger"
          return '已拒绝'
      } else if (entity.status === 'executed') {
        entity.fieldClass.status = "label label-success"
        return '已履行'
      } else if (entity.status === 'canceled') {
        entity.fieldClass.status = "label label-default"
        return '已取消'
      } else if (entity.status === 'paid') {
        entity.fieldClass.status = "label label-default"
        return '已结账'
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
      key:'',
      value: '全部'
    },
    {
      key:'placed',
      value:'已下单'
    },
    {
      key:'accepted',
      value:'已接受'
    },
    {
      key:'rejected',
      value:'已拒绝'
    },
    {
      key:'executed',
      value:'已履行'
    },
    {
      key:'canceled',
      value:'已取消'
    },
    {
      key:'paid',
      value:'已结账'
    }
  ];
  $scope.currentBtn = {};
  $scope.currentBtn.btn = $scope.btns[0];
  $scope.search = {};
  $scope.$watch('currentBtn.btn', function () {
    var key = $scope.currentBtn.btn.key;
    $scope.search.text = key;
    $timeout(function () {
      $scope.refreshList();
    }, 10)
  });
  $scope.isHide = true; //隐藏新增按钮
  $scope.params['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
  $scope.countQs['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
}