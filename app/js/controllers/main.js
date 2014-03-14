function MainController($scope, Users, Merchants, Shops) {
  if (!$scope.me) $scope.me = {displayName: '未登录'};
  $scope.hideMainMenu = false;
  $scope.switchMainMenu = function () {
    $scope.hideMainMenu = !$scope.hideMainMenu;
  }
  $scope.views = [
    {name: "销售统计", icon: "fa fa-bar-chart-o fa-lg", path: "views/analysis/salesAnalysis.html"},
    {name: "进货统计", icon: "fa fa-truck fa-lg", path: "views/analysis/skusAnalysis.html"},
    {name: "设备管理", icon: "fa fa-tablet fa-lg", path: "views/devices/index.html"},
    {name: "营业流水", icon: "fa fa-bars fa-lg", path: "views/deals/index.html", submenus: [
      {name: "销售流水", icon: "fa fa-shopping-cart", path: "views/deals/index.html"},
      {name: "退货流水", icon: "fa fa-exchange", path: "views/returns/index.html"},
      {name: "储值流水", icon: "fa fa-rmb", path: "views/bills/index.html"}
    ]},
    {name: "商户管理", icon: "fa fa-home fa-lg", path: "views/shop/index.html", submenus:[
      {name: "商店管理", icon: "fa fa-building-o", path: "views/shop/index.html"},
      {name: "员工管理", icon: "fa fa-users", path: "views/employee/index.html"},
      {name: "商品管理", icon: "fa fa-barcode", path: "views/item/index.html"},
      {name: "库存记录", icon: "fa fa-truck", path: "views/skus/index.html"},
      {name: "会员管理", icon: "fa fa-user", path: "views/members/index.html"},
      {name: "积分管理", icon: "fa fa-gift", path: "views/points/index.html"},
      {name: "当前商户", icon: "fa fa-cog", path: "views/merchant/index.html"}
    ]}
  ];

  $scope.currentView = $scope.views[0];

  $scope.selectView = function (view) {
    $scope.currentView = view

    if (view.name == '流水管理' || view.name == '商户管理') {
      $scope.viewName = view.name;
    }
    if (view.name == '设备管理') {
      $scope.viewName = '';
    }

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
        $scope.currentMerchant.merchant = merchants[7] || merchants[0]; // the default merchant('吉林省梅河口中联商业广场') is in merchants[7]
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
      Shops.query({merchantID:$scope.currentMerchant.merchant.id}, function (shops) {
        $scope.currentShowShop.shop = shops[12] || shops[0];
        $scope.allShop = shops;
      });
    }
  })

  $scope.patternForIdcard = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  $scope.patternForTelephone = /^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/;
  $scope.patternForphone = /^0\d{2,3}(\-)?\d{7,8}$/;
  $scope.patternForEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
};