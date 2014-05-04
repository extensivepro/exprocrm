/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Employes, Pagination, $timeout, $injector, $modal) {
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Skus;
  $scope.searchOptions.fields = ['operator.name']
  $scope.searchOptions.tooltip = "请输入经手人名称";
  $scope.editView = "views/skus/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileShortcuts = [];

  $scope.profileFields = [
    {name: "shopID", title: "商店ID", required: true, listHide: true, createHide: true, isProfileHide:true},
    {name: "itemCode", title: "商品编码", required: true},
    {name: "itemName", title: "商品", required: true},
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
    {name: "averagePrice", title: "均价", value: function (entity) {
      return (((entity.sumPrice / 100)) / parseInt(entity.quantity)).toFixed(2);
    }, createHide: true},
    {name: "operator", title: "经手人", required: true, value: function (entity) {
      return entity.operator.name;
    }},
    {name: "createdAt", title: "日期", required: true, createHide: true},
    {name: "merchantID", title: "商户ID", required: true, listHide: true, isProfileHide: true, createHide: true},
    {name: "updateAt", title: "更新日期", listHide: true, required: true, isProfileHide: true, createHide: true},
    {name: "dealType", title: "类型", value: function (entity) {
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
    }}
  ];
  $scope.hideManyDel = true; //隐藏批量删除按钮
  // bussiness
  $scope.setStatus = function (status) {
    $scope.entity.status = status
    $scope.update(true)
  };
  $scope.create = function () {
    if (!$scope.operator.name) {
      alert('您尚未创建店长');
      return;
    }
    var skus = {
      shopID: $scope.currentShowShop.shop.id,
      merchantID: $scope.currentMerchant.merchant.id,
      createdAt: Math.round(new Date().getTime() / 1000),
      itemName: $scope.entity.itemName,
      quantity: parseInt($scope.entity.quantity, 10),
      sumPrice: parseInt($scope.entity.quantity, 10) * parseFloat($scope.entity.price, 10) * 100,
      operator: $scope.operator
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
        skus['itemID'] = item.id;
        saveSkus(skus);
      }, function (err) {
        console.log('新增商品失败:', err);
      });
    } else {
      skus['itemID'] = $scope.entity.itemID;
      saveSkus(skus);
    }
  }
  function saveSkus(skus) {
    var newSkus = new $scope.resource(skus);
    newSkus.$save(function (skus) {
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

  $scope.$watch('currentShowShop.shop', function () {
    $scope.params['shopID'] = $scope.currentShowShop.shop.id; // default use the first shop of the currentMerchant
    $scope.countQs['shopID'] = $scope.currentShowShop.shop.id;
    $scope.refreshList();
  })
  $scope.showOptions = true;
  $scope.showEdit = function (entity) {
    $scope.entity = {};
    $scope.entity.selection = $scope.types[0];
    $scope.activeView = "views/skus/create.html"
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
  $scope.getInfo = function (itemCode) {
    Items.query({code: itemCode, merchantID: $scope.currentMerchant.merchant.id}, function (res) {
      if (res[0]) {
        $scope.isNewItem = false;
        $scope.entity.itemName = res[0].name;
        $scope.entity.quantity = '1';
        $scope.entity.itemID = res[0].id;
      } else {
        $scope.isNewItem = true;
        $scope.entity.itemName = '';
        $scope.entity.quantity = '';
        $scope.entity.itemID = '';
      }
    });
  };
  $scope.initSkus = function () {
    $scope.isNewItem = false;
    $scope.item = {}; //when create a skus, if the item is a newer,then use the $scope.item object to save the new item。
    $scope.flagForShopManger = false; // 该店已经有店长了
    $scope.operator = {}; // 店长
  };
  $scope.checkShopManger = function () {
    Employes.query({"shopID":$scope.currentShowShop.shop.id, "role":"shopManager"}, function (result) {
      console.log('result:\n', result);
      if (!result.length) {
        $scope.flagForShopManger = true; // 该店没有查到店长
      } else {
        $scope.operator = {
          employeeID:result[0].id,
          name: result[0].name
        }
      }
    }, function (err) {
      console.log('err:\n', err);
    })
  };
  $scope.$watch('flagForShopManger', function () {
    if ($scope.flagForShopManger) {
      $scope.openModal();
    }
  });
  $scope.openModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'createShopManger.html',
      controller: CreateShopMangerCtrl,
      resolve: {
        shopID: function () {
          return $scope.currentShowShop.shop.id;
        }
      }
    });
    modalInstance.result.then(function (employee) {
      $scope.operator = employee;
      alert('店长创建成功，请继续您的操作');
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}

var CreateShopMangerCtrl = function ($scope, $modalInstance, $timeout, Employes, shopID) {
  $scope.employee = {};
  $scope.errContent = {msg:''};
  $scope.ok = function () {
    if (check()) {
      var v = $scope.employee;
      var obj = {
        shopID:shopID,
        name: v.name,
        role: "shopManager",
        jobNumber: v.jobNumber,
        phone: v.phone,
        idcard: v.idcard,
        createdAt: Math.round(new Date().getTime() / 1000)
      };
      Employes.save(obj, function (result) {
        var o = {
          employeeID:result.id,
          name: result.name
        };
        $modalInstance.close(o);
      }, function (err) {
        console.log('err:\n', err);
      });
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  function check() {
    var v = $scope.employee;
    var m = $scope.errContent;
    if (!v.name) {
      m.msg = '姓名不能为空';
      return showAlert();
    } else if(isNaN(parseInt(v.jobNumber))){
      m.msg = '工号必须由数字组成';
      return showAlert();
    } else if (!(/^1\d{10}$/.test(v.phone))) {
      m.msg = '手机号格式不正确';
      return showAlert();
    } else if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(v.idcard))) {
      m.msg = '身份证号码格式不对';
      return showAlert();
    } else {
      return true;
    }
  }
  function showAlert() { // 2秒后错误消息消失，并返回false
    $timeout(function () {
      $scope.errContent.msg = '';
    }, 2000);
    return false;
  }
};