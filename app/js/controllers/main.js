function MainController($scope, Users, Merchants, Shops) {
  if (!$scope.me) $scope.me = {displayName: '未登录'};
  $scope.views = [
    {name: "销售统计", icon: "fa fa-bar-chart-o", path: "views/analysis/salesAnalysis.html"},
    {name: "库存统计", icon: "fa fa-bar-chart-o", path: "views/analysis/skusAnalysis.html"},
    {name: "设备管理", icon: "fa fa-tablet", path: "views/devices/index.html"},
    {name: "流水管理", icon: "fa fa-tablet", path: "views/deals/index.html", submenus: [
      {name: "销售流水", icon: "fa fa-cogs", path: "views/deals/index.html"},
      {name: "退货流水", icon: "fa fa-trash-o", path: "views/returns/index.html"},
      {name: "储值流水", icon: "fa fa-retweet", path: "views/bills/index.html"}
    ]},
    {name: "商户管理", icon: "fa fa-tablet", path: "views/shop/index.html", submenus:[
      {name: "商店管理", icon: "fa fa-inbox", path: "views/shop/index.html"},
      {name: "员工管理", icon: "fa fa-wrench", path: "views/employee/index.html"},
      {name: "商品管理", icon: "fa fa-cog", path: "views/item/index.html"},
      {name: "库存管理", icon: "fa fa-truck", path: "views/skus/index.html"},
      {name: "会员管理", icon: "fa fa-user", path: "views/members/index.html"},
      {name: "积分管理", icon: "fa fa-gift", path: "views/points/index.html"},
      {name: "当前商户", icon: "fa fa-gift", path: "views/merchant/index.html"}
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
  $scope.currentMerchant = {};
  $scope.currentShowShop = {
    shop:{}
  };
  $scope.allShop = [];
  $scope.init = function () {
    Users.me(function (me) {
      $scope.me = me;
      Merchants.query({'owner.id':me.id}, function (merchants) {
        $scope.currentMerchant = merchants[7] || merchants[0]; // the default merchant('吉林省梅河口中联商业广场') is in merchants[7]
      })
    }, function () {
      $scope.me = {displayName: '未登录'};
    })
  }
  $scope.showOp = function (index) {
    $scope.currentIndex = index;
  };
  $scope.$watch('currentMerchant', function () {
    if ($scope.currentMerchant['address']) {
      Shops.query({merchantID:$scope.currentMerchant.id}, function (shops) {
        $scope.currentShowShop.shop = shops[12] || shops[0];
        shops.forEach(function (item) {
          $scope.allShop.push(item);
        });
      });
    }
  })
  $scope.showCheckbox = function () {
    $scope.showCbx = !$scope.showCbx;
  }
  $scope.checked = false;
};