function MainController($scope, Users){
  if(!$scope.me) $scope.me = {displayName:'未登录'}; 
	$scope.views = [
    {name:"用户管理", icon:"icon-user-md", path:"views/user/profile.html"},
    {name:"会员管理", icon:"icon-user-md", path:"views/members/index.html"},
    {name:"库存管理", icon:"icon-user-md", path:"views/skus/index.html"},
    {name:"商户管理", icon:"icon-user-md", path:"views/merchant/index.html"},
    {name:"商店管理", icon:"icon-user-md", path:"views/shop/index.html"},
    {name:"员工管理", icon:"icon-user-md", path:"views/employee/index.html"},
    {name:"商品管理", icon:"icon-user-md", path:"views/item/index.html"},
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