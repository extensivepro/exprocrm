function HeaderController($scope, $location, Users) {
  $scope.me = {displayName:'未登录'};
	$scope.showSettingPasswordModal = false;

	$scope.signout = function() {
		$location.path('/home');
		Users.signout($scope.uuser);
	};
	$scope.init = function() {
    $scope.userName = Users.me(function(me){
      $scope.me = me;
    }, function () {
      $scope.me.displayName = '未登录';
    })
	};
}