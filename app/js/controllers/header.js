function HeaderController($scope, $location, Users, $modal, $log) {
  $scope.showMeProfile = function () {
    $log.info('Show Profile :' + new Date());
    $scope.selectViewByPath('views/user/profile.html');
    $scope.showProfile($scope.me);
  }
  
  $scope.showChangePasswordDialog = function () {
    // $log.info('Open passoword Dialog :' + new Date());
    var modalInstance = $modal.open({
      templateUrl: 'passwordDialog.html',
      controller: SettingPasswordController,
      resolve: {
        me: function () {
          return $scope.me;
        }
      }
    });
    modalInstance.result.then(function () {
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };
  
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.signout = function() {
    Users.logout();
    $location.path('/home');
  };
}

function SettingPasswordController($scope, $rootScope, Users, $modalInstance, me) {
  $scope.me = me;
	$scope.newPassword = "";
	$scope.passwordConfirmation = "";
	
	$scope.setPassword = function() {
		if($scope.newPassword === "" || $scope.passwordConfirmation === "") {
      $scope.alert = { type: 'danger', msg: "密码不能为空" };
		} else if($scope.newPassword !== $scope.passwordConfirmation) {
      $scope.alert = { type: 'danger', msg: "两次输入密码不一致" };
    } else if($scope.newPassword.length < 6) {
      $scope.alert = { type: 'danger', msg: "密码长度不能小于6位" };
		} else {
			Users.save({userID:$scope.me.id}, {password:$scope.newPassword}, function() {
        $scope.alert = { type: 'success', msg: "修改密码成功" };
        $modalInstance.close();
			}, function() {
        $scope.alert = { type: 'danger', msg: "更新失败请重试" };
			})
		}
	}

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.closeAlert = function () {
    $scope.alert = null;
  }
}