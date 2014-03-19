/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Pagination, $timeout, $injector, $http){
    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Skus;
    $scope.searchOptions.fields = ['operator.name']
    $scope.searchOptions.tooltip = "请输入经手人名称";
    $scope.editView = "views/skus/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"
    $scope.fieldOperations = [
      {class: "btn btn-success", icon: "fa fa-file", op: "showProfile", title:'详情'}
      ,
      {class: "btn btn-danger", icon: "fa fa-trash-o", op: "remove", title:'删除'}
    ]
//    $scope.isHide = true;
    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID", required:true, listHide:true, createHide:true},
        {name: "itemCode", title: "商品编码", required:true},
        {name: "itemName", title: "商品", required:true},
        {name: "dealType", title: "类型", isProfileHide:true, value: function (entity) {
          entity.fieldClass = {};
          if (entity.type == 'add') {
            entity.fieldClass.dealType = "label label-success"
            return "进货"
          } else if (entity.type == 'sub') {
            entity.fieldClass.dealType = "label label-warning"
            return "核销"
          } else{
            entity.fieldClass.dealType = "label label-success"
            return "进货";
          }
        }},
        {name: "quantity", title: "数量", required:true, value: function (entity) {
          if (entity.type == 'add') {
            return entity.quantity;
          } else if (entity.type == 'sub') {
            return parseInt(entity.quantity) * (-1);
          } else {
            return entity.quantity;
          }
        }},
        {name: "sumPrice", title: "总金额", required:true,value:function(entity) {
          if (entity.type == 'add') {
            return (entity.sumPrice/100).toFixed(2);
          } else if (entity.type == 'sub') {
            return -(entity.sumPrice/100).toFixed(2);
          } else {
            return (entity.sumPrice/100).toFixed(2);
          }
        }},
        {name: "averagePrice", title: "均价", isProfileHide:true,value:function(entity) {
          return (((entity.sumPrice/100)) / parseInt(entity.quantity)).toFixed(2);
        }, createHide:true},
        {name: "createdAt", title: "日期", required:true, createHide:true},
        {name: "operator", title: "经手人", required:true, value:function(entity) {
            return entity.operator.name;
        }},
        {name: "status", title: "状态", required:true, listHide:true},
        {name: "merchantID", title: "商户ID", required:true, listHide:true, createHide:true},
        {name: "updateAt", title: "更新日期", listHide:true, required:true, createHide:true}

    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    };
    $scope.create = function(entity) {
          entity.operator = {
            employeeID: "6d97c241f56a8873",
            name: "老板"
          };
          entity.shopID = $scope.currentShowShop.shop.id;
          entity.merchantID = $scope.currentMerchant.merchant.id;
          entity['type'] = $scope.entity.selection.value;
          entity.sumPrice = parseInt($scope.entity.quantity, 10) * parseInt($scope.entity.price, 10);
          entity.createdAt = Math.round(new Date().getTime()/1000);
          var newOne = new $scope.resource(entity)
           newOne.$save(function(user) {
           console.log("success",user)
           $scope.showList()
           },function(err){
           console.log('error:', err)
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
  }
    $scope.getInfo = function(val) {
      $http.get(window.restful.baseURL + '/items', {
        params: {
          code: val,
          merchantID : $scope.currentMerchant.merchant.id
        }
      }).then(function(res){
          if (res.data[0]) {
            $scope.entity.itemName = res.data[0].name;
            $scope.entity.quantity = '1';
            $scope.entity.price = res.data[0].price;
            $scope.entity.itemID = res.data[0].id;
          }
        });
    };
  $scope.types = [
    {
      label: '进货',
      value: 'add'
    },
    {
      label:'核销',
      value:'sub'
    }
  ];

}