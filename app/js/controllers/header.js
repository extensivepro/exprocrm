function HeaderController($scope, $location, Users, $modal, $log) {
  $scope.showMeProfile = function () {
    $scope.user = $scope.__proto__.$parent.me;
    var modalInstance = $modal.open({
      templateUrl: 'userProfileDialog.html',
      controller: ShowUserProfileController,
      resolve: {
        me: function () {
          return $scope.user;
        }
      }
    });
    modalInstance.result.then(function () {
    }, function () {

    });

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

  $scope.signout = function() {
    Users.logout();
    $location.path('/home');
  };
}
function ShowUserProfileController($scope, $modalInstance, me) {
  $scope.me = me;
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "username", title: "用户名", readonly:true}
    , {name: "name", title: "姓名"}
    , {name: "idcard", title: "身份证"}
    , {name: "phone", title: "电话"}
    ,	{name: "email", title: "电子邮箱"}
    ,	{name: "createdAt", title: "注册日期", readonly:true}
    ,	{name: "male", title: "性别", value:function(me){
      if(me.male) {
        return "男"
      } else if(me.male == false) {
        return "女"
      } else {
        return "保密"
      }
    }}
  ];
  $scope.valueOfKeyString = function (entity, keyString) {
    var v = entity
    var keys = keyString.split('.')
    var theKey = keys[0]
    keys.forEach(function (key) {
      theKey = key
      v = v[key]
    })
    if (theKey === 'createdAt' || theKey === 'updateAt') {
      v = new Date(v * 1000).toLocaleString()
    }
    return v
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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