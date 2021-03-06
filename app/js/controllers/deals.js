
/**
 * Created by expro on 14-1-10.
 * 销售管理
 */
function DealsController($scope, Deals, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Deals;
    $scope.searchOptions.fields = ['buyer.name', 'seller.name']
    $scope.searchOptions.tooltip = "请输入顾客姓名或收银员姓名"
    $scope.editView = "views/deals/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"
    $scope.loading = false;
    $scope.entitiesWh = undefined;

    $scope.exportExcel = function(){
      $scope.loading = true;
      var param = {$sort: $scope.sortOptions,
      shopID: $scope.currentShowShop.shop.id};
      Deals.query(param, function(result){
        $scope.loading = false;
        $scope.entitiesWh = result;
        if ($scope.entitiesWh != undefined){
          setTimeout(function(){
            var blob = new Blob([document.getElementById('exportable').innerHTML], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "销售记录.xls");
          }, 1)
        }
        console.log(result);
      })
    }

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
      {name: "serialNumber", title: "流水号", required: true},
      {name: "shopID", title: "商店ID", listHide: true, isProfileHide: true},
      {name: "deviceCode", title: "设备编码", listHide: true, required: true, isProfileHide: true},
      {name: "deviceID", title: "设备ID", listHide: true, required: true, isProfileHide: true},
      {name: "billID", title: "交易ID", listHide: true, required: true, isProfileHide: true},
      {name: "buyer", title: "顾客", value: function (entity) {
        if (entity.hasOwnProperty('buyer')) {
          return entity.buyer.name;
        } else {
          return '走入顾客';
        }
      }, required: true},
      {name: "items", title: "商品", value: function (entity) {
        var itemNames = "";
        entity.items.forEach(function (item) {
          itemNames += item.item.name + " ";
        });
        return itemNames;
      }, required: true},
      {name: "quantity", title: "总数", required: true},
      {name: "fee", title: "成交金额", required: true, value: function (entity) {
        return (entity.fee / 100).toFixed(2);
      } },
      {name: "memo", title: "memo", listHide: true, required: true, isProfileHide: true},
      {name: "seller.name", title: "收银员", required: true},
      {name: "createdAt", title: "交易时间", required: true}

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
    $scope.isHide = true; //隐藏新增按钮
    $scope.$watch('currentShowShop.shop', function () {
      $scope.params['shopID'] = $scope.currentShowShop.shop.id; // default use the first shop of the currentMerchant
      $scope.countQs['shopID'] = $scope.currentShowShop.shop.id;
      $scope.refreshList();
    });
    $scope.defaultString = "buyer.name";
    $scope.showOptions = true;
    $scope.showExport = true;

    $scope.showProfile = function (entity) {
      $scope.entity = entity || $scope.entity;
      $scope.activeView = "views/deals/profile.html";
      $scope.trackListPage.activeView = '';
    }
}