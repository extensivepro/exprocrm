/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Pagination, $timeout, $injector){
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
    $scope.isHide = true;
    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID", required:true, listHide:true},
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
        }},
        {name: "createdAt", title: "日期", required:true},
        {name: "operator", title: "经手人", required:true, value:function(entity) {
            return entity.operator.name;
        }},
        {name: "status", title: "状态", required:true, listHide:true},
        {name: "merchantID", title: "商户ID", required:true, listHide:true},
        {name: "updateAt", title: "更新日期", listHide:true, required:true}

    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    };
    $scope.create = function(entity) {
        entity.operator = {"employeeID":"101"};
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
}