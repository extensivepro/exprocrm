/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Pagination, $timeout, $injector) {
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Skus;
  $scope.searchOptions.fields = ['operator.name']
  $scope.searchOptions.tooltip = "请输入经手人名称";
  $scope.editView = "views/skus/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.fieldOperations = [
    {class: "btn btn-success", icon: "fa fa-file", op: "showProfile", title: '详情'}
    ,
    {class: "btn btn-danger", icon: "fa fa-trash-o", op: "remove", title: '删除'}
  ]
//    $scope.isHide = true;
  // profile
  $scope.profileFields = [
//        {name: "id", title: "id"},
    {name: "shopID", title: "商店ID", required: true, listHide: true, createHide: true},
    {name: "itemCode", title: "商品编码", required: true},
    {name: "itemName", title: "商品", required: true},
    {name: "dealType", title: "类型", isProfileHide: true, value: function (entity) {
      entity.fieldClass = {};
      if (entity.type == 'add') {
        entity.fieldClass.dealType = "label label-success"
        return "进货"
      } else if (entity.type == 'sub') {
        entity.fieldClass.dealType = "label label-warning"
        return "核销"
      } else {
        entity.fieldClass.dealType = "label label-success"
        return "进货";
      }
    }},
    {name: "quantity", title: "数量", required: true, value: function (entity) {
      if (entity.type == 'add') {
        return entity.quantity;
      } else if (entity.type == 'sub') {
        return parseInt(entity.quantity) * (-1);
      } else {
        return entity.quantity;
      }
    }},
    {name: "sumPrice", title: "总金额", required: true, value: function (entity) {
      if (entity.type == 'add') {
        return (entity.sumPrice / 100).toFixed(2);
      } else if (entity.type == 'sub') {
        return -(entity.sumPrice / 100).toFixed(2);
      } else {
        return (entity.sumPrice / 100).toFixed(2);
      }
    }},
    {name: "averagePrice", title: "均价", isProfileHide: true, value: function (entity) {
      return (((entity.sumPrice / 100)) / parseInt(entity.quantity)).toFixed(2);
    }, createHide: true},
    {name: "createdAt", title: "日期", required: true, createHide: true},
    {name: "operator", title: "经手人", required: true, value: function (entity) {
      return entity.operator.name;
    }},
    {name: "status", title: "状态", required: true, listHide: true},
    {name: "merchantID", title: "商户ID", required: true, listHide: true, createHide: true},
    {name: "updateAt", title: "更新日期", listHide: true, required: true, createHide: true}

  ];

  // bussiness
  $scope.setStatus = function (status) {
    $scope.entity.status = status
    $scope.update(true)
  };

  $scope.item = {}; //when create a skus, if the item is a newer,then use the $scope.item object to save the new item。
  $scope.create = function () {
    var skus = {
      shopID: $scope.currentShowShop.shop.id,
      merchantID: $scope.currentMerchant.merchant.id,
      createdAt: Math.round(new Date().getTime() / 1000),
      itemName: $scope.entity.itemName,
      quantity: parseInt($scope.entity.quantity, 10),
      sumPrice: parseInt($scope.entity.quantity, 10) * parseFloat($scope.entity.price, 10) * 100,
      operator: {
        employeeID: "6d97c241f56a8873",
        name: "老板"
      }
    }
    skus['type'] = $scope.entity.selection.value;
    if ($scope.isNewItem) {
      var item = {
        code: $scope.entity.itemCode,
        createdAt: Math.round(new Date().getTime() / 1000),
        merchantID: $scope.currentMerchant.merchant.id,
        price: parseFloat($scope.item.itemPrice) * 100,
        desc: $scope.item.itemDesc,
        model: $scope.item.itemModel,
        name: $scope.entity.itemName,
        status: 'sale'
      };
      console.log('item:', item);
      var newItem = new Items(item);
      newItem.$save(function (item) {
        console.log('新增商品成功：', item);
        skus['itemID'] = item.id;
        console.log('保存之前的skus:', skus);
        saveSkus(skus);
      }, function (err) {
        console.log('新增商品失败:', err);
      });
    } else {
      skus['itemID'] = $scope.entity.itemID;
      console.log('保存之前的skus:', skus);
      saveSkus(skus);
    }
  }
  function saveSkus(skus) {
    var newSkus = new $scope.resource(skus);
    newSkus.$save(function (skus) {
      console.log('新增库存成功：', skus);
      $scope.showList();
      $scope.entity = {};
      $scope.item = {};
      $scope.isNewItem = false;
    }, function (err) {
      console.log('新增库存失败：', err);
      $scope.entity = {};
      $scope.item = {};
      $scope.isNewItem = false;
    })
  }

  if ($scope.currentMerchant.merchant.hasOwnProperty('shopIDs')) {
    $scope.params['shopID'] = $scope.currentMerchant.merchant.shopIDs[0]; // default use the first shop of the currentMerchant
    $scope.countQs['shopID'] = $scope.currentMerchant.merchant.shopIDs[0];
  }
  $scope.defaultString = "operator.name";

  $scope.$watch('currentShowShop.shop', function () {
    $scope.params['shopID'] = $scope.currentShowShop.shop.id; // default use the first shop of the currentMerchant
    $scope.countQs['shopID'] = $scope.currentShowShop.shop.id;
    $scope.refreshList();
  })
  $scope.showOptions = true;
  $scope.showEdit = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.entity.selection = $scope.types[0];
    $scope.activeView = "views/basicEditForSkus.html"
  };

  $scope.getInfo = function (itemCode) {
    Items.query({code: itemCode, merchantID: $scope.currentMerchant.merchant.id}, function (res) {
      if (res[0]) {
        $scope.isNewItem = false;
        $scope.entity.itemName = res[0].name;
        $scope.entity.quantity = '1';
        $scope.entity.itemID = res[0].id;
      } else {
        $scope.isNewItem = true;
      }
    });
  };

  $scope.types = [
    {
      label: '进货',
      value: 'add'
    },
    {
      label: '核销',
      value: 'sub'
    }
  ];

}