function MainController($scope, $modal, Users, Merchants, Shops, localStorageService) {
  if (!$scope.me) $scope.me = {displayName: '未登录'};
  $scope.hideMainMenu = false;
  $scope.switchMainMenu = function () {
    $scope.hideMainMenu = !$scope.hideMainMenu;
  };
  
  $scope.views = [
    {name: "控制面板", icon: "fa fa-dashboard", path: "views/analysis/dashboard.html"},
    {name: "销售统计", icon: "fa fa-bar-chart-o", path: "views/analysis/salesAnalysis.html"},
    {name: "进货统计", icon: "fa fa-truck", path: "views/analysis/skusAnalysis.html"},
    {name: "营业流水", icon: "fa fa-bars", path: "views/deals/index.html", submenus: [
      {name: "销售流水", icon: "fa fa-shopping-cart", path: "views/deals/index.html"},
      {name: "退货流水", icon: "fa fa-exchange", path: "views/returns/index.html"},
      {name: "储值流水", icon: "fa fa-rmb", path: "views/bills/index.html"},
      {name: "订单流水", icon: "fa fa-pencil-square", path: "views/orders/index.html"}
    ]},
    {name: "品类管理", icon: "fa fa-barcode", path: "views/item/index.html", submenus: [
      {name: "商品管理", icon: "fa fa-barcode", path: "views/item/index.html"},
      {name: "标签管理", icon: "fa fa-tags", path: "views/tags/index.html"}
    ]},
    {name: "商户管理", icon: "fa fa-building-o", path: "views/shop/index.html", submenus:[
      {name: "门店管理", icon: "fa fa-home", path: "views/shop/index.html"},
      {name: "员工管理", icon: "fa fa-users", path: "views/employee/index.html"},
      {name: "库存记录", icon: "fa fa-truck", path: "views/skus/index.html"},
      {name: "会员管理", icon: "fa fa-user", path: "views/members/index.html"},
      {name: "积分管理", icon: "fa fa-gift", path: "views/points/index.html"},
      {name: "当前商户", icon: "fa fa-cog", path: "views/merchant/index.html"}
    ]},
    {name: "设备管理", icon: "fa fa-tablet", path: "views/devices/index.html"}
  ];
  $scope.trackListPage = {};
  $scope.currentView = $scope.views[0];

  $scope.selectView = function (view) {
    if (view.name == '营业流水' || view.name == '商户管理'|| view.name == '品类管理') {
      return;
    }
    $scope.currentView = view;
    $scope.trackListPage.activeView = 'views/basicList.html';
  };

  $scope.selectViewByPath = function (path) {
    $scope.views.some(function (view) {
      if (view.path === path) {
        $scope.currentView = view
        return true
      } else {
        return view.submenus.some(function (submenu) {
          if (submenu.path === path) {
            $scope.currentView = submenu
            console.log(submenu, path)
            return true
          } else {
            return false
          }
        });
      }
    });
  };
  $scope.currentMerchant = {
    merchant:{}
  };
  $scope.currentShowShop = {
    shop:{}
  };
  $scope.allShop = [];
  $scope.allMerchant = [];
  $scope.init = function () {
    Users.me(function (me) {
      $scope.me = me;
      Merchants.query({'owner.id':me.id}, function (merchants) {
        var index = 0;
        var localStrage = localStorageService.get('localStorageCurrentMerchant');
        if (localStrage && localStrage.id) {
          var localID = localStrage.id || '';
          if (localID) {
            merchants.forEach(function (merchant, i) {
              if (merchant.id == localID) {
                index = i;
                return;
              }
            })
          }
        }
        $scope.currentMerchant.merchant = merchants[index];
        $scope.allMerchant = merchants;
      });
    }, function () {
      $scope.me = {displayName: '未登录'};
    })
  }
  $scope.showOp = function (index) {
    $scope.currentIndex = index;
  };
  $scope.$watch('currentMerchant.merchant', function () {
    if ($scope.currentMerchant.merchant['id']) {
      Shops.query({merchantID:$scope.currentMerchant.merchant.id, $limit:100}, function (shops) {
        $scope.currentShowShop.shop = shops[2] || shops[0];
        $scope.allShop = shops;
      });
    }
  })
  
  $scope.showTwoDimensionalCode = function () {
    $modal.open({
      templateUrl: 'TwoDimensionalCode.html'
    })
  }

  $scope.patternForIdcard = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  $scope.patternForTelephone = /^(([0\+]\d{2,3})?(0\d{2,3}))?(\d{7,8})((\d{3,}))?$/;
  $scope.patternForphone = /^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/;
  $scope.patternForEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
};
