function MainController($scope, Users){
  if(!$scope.me) $scope.me = {displayName:'未登录'}; 
	$scope.views = [ 
      //       {name:"会员管理", icon:"icon-user", path:"views/member/index.html", submenus:[
      //     {name:"储值账单", icon:"icon-list", path:"views/member/balanceIndex.html"}
      //   ,  {name:"会员充值", icon:"icon-money", path:"views/member/recharge.html"}
      //   ,  {name:"积分清单", icon:"icon-list-alt", path:"views/member/pointLogIndex.html"}
      //   ,  {name:"积分累积", icon:"icon-plus", path:"views/member/accumulate.html"}
      // ]}
      // {name:"门店管理", icon:"icon-folder-close-alt", path:"views/shop/index.html", submenus: [
      //     {name:"门店员工", icon:"icon-hdd", path:"views/employe/index.html"}
      // ]},

			{name:"用户管理", icon:"icon-user-md", path:"views/user/profile.html"},
			{name:"会员管理", icon:"icon-user-md", path:"views/members/index.html"},
			{name:"库存管理", icon:"icon-user-md", path:"views/skus/index.html"},
			{name:"销售管理", icon:"icon-user-md", path:"views/bills/index.html"},
			{name:"退货管理", icon:"icon-user-md", path:"views/returns/index.html"},
			{name:"储值管理", icon:"icon-user-md", path:"views/accounts/index.html"}

	];
	$scope.currentView = $scope.views[0];
	
	$scope.selectView = function(view) {
		$scope.currentView = view
	};
	
	$scope.selectViewByPath = function(path) {
		$scope.views.some(function(view){
			if(view.path === path) {
				$scope.currentView = view
				return true
			} else {
				return view.submenus.some(function(submenu){
					if(submenu.path === path) {
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
  
  $scope.init = function () {
    Users.me(function(me){
      $scope.me = me;
    }, function () {
      $scope.me = {displayName:'未登录'}; 
    })
  }
};