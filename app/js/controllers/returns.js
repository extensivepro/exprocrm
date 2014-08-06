
/**
 * Created by expro on 14-1-10.
 * 退货管理
 */
function ReturnsController($scope, Returns, Pagination, $timeout, $injector){
    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Returns;
    $scope.searchOptions.fields = ['agent.name', 'customer.name']
    $scope.searchOptions.tooltip = "请输入经手人姓名或顾客姓名"
    $scope.editView = "views/returns/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
      {name: "shopID", title: "商店ID", listHide:true, isProfileHide:true},
      {name: "dealID", title: "交易ID", listHide:true, isProfileHide:true},
      {name: "billID", title: "账单ID", listHide:true, isProfileHide:true},
      {name: "dealSerialNumber", title: "退单号"},
      {name: "serialNumber", title: "交易流水号", listHide:true},
      {name: "customer", title: "顾客",value:function(entity) {
          if (entity.hasOwnProperty("customer")) {
              return entity.customer.name;
          } else {
              return "走入顾客";
          }
      }},
      {name: "memo", title: "memo", listHide:true, isProfileHide:true},
      {name: "items", title: "退货商品", value: function (entity) {
        var itemNames = "";
        entity.items.forEach(function (item) {
          itemNames += item.dealItem.item.name + " ";
        });
        return itemNames;
      }},
      {name: "quantity", title: "总数"},
      {name: "fee", title: "退款",value:function(entity) {
          return (entity.fee/100).toFixed(2);
      }},
      {name: "deviceID", title: "deviceID", listHide:true, isProfileHide:true},
      {name: "agent", title: "经手人", value:function(entity) {
          return entity.agent.name;
      }},
      {name: "createdAt", title: "退货时间"}
    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
    $scope.fieldOperations = [
        {"class": "btn btn-success", icon: "fa fa-file", op: "showProfile"}
        ,	{"class": "btn btn-danger", icon: "fa fa-trash-o", op:"remove"}
    ]

    // profile
    $scope.profileShortcuts = [
        {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-trash-o", text: "删除", op:"remove"}
    ];
    $scope.isHide = true;
    $scope.$watch('currentShowShop.shop', function () {
      $scope.params['shopID'] = $scope.currentShowShop.shop.id; // default use the first shop of the currentMerchant
      $scope.countQs['shopID'] = $scope.currentShowShop.shop.id;
      $scope.refreshList();
    })
    $scope.defaultString = "agent.name";
    $scope.showOptions = true;
    $scope.showProfile = function (entity) {
      $scope.entity = entity || $scope.entity;
      $scope.activeView = "views/returns/profile.html";
    }
}