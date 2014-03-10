function SignController($scope, Users, $location, $modal, $cookies, $log){
	$scope.loginUser = {
		username:"", password:""
	}

  $scope.registerUser = {
    username: "", password: "",
    displayName: "", idcard: "",
    email: "", male: true, phone: ""}


  $scope.registerWizard = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: RegisterModalController,
      resolve: {
        registerUser: function () {
          return $scope.registerUser;
        }
      }
    });

    modalInstance.result.then(function (registerUser) {
      Users.save(registerUser, function(){console.log('user registered')})
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
	
	$scope.Login = function() {
    $('input').checkAndTriggerAutoFillEvent();
		var user = $scope.loginUser;
		if(!user.username || user.username.length === 0 || !user.password || user.password.length === 0) {
      $scope.alert = { type: 'danger', msg: "用户名和密码不能为空" };
      return;
    }
		Users.login(user, function(data){
			user = {username:"", password:""};
			$location.path('/main');
		},function(){
      $scope.alert = { type: 'danger', msg: "用户名或密码不正确" };
		});
	};
}