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

  $scope.showUserSettingDialog = function () {
    // $log.info('Open passoword Dialog :' + new Date());
    $scope.user = $scope.__proto__.$parent.me;
    var modalInstance = $modal.open({
      templateUrl: 'userSettingDialog.html',
      controller: UserSettingController,
      resolve: {
        me: function () {
          return $scope.user;
        }
      }
    });
    modalInstance.result.then(function () {
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  };
  
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
//  console.log($scope.me)
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

function UserSettingController($scope, Users, $modalInstance, me) {
  $scope.me = me;
//  console.log($scope.me)
  $scope.profileFields = [
    {name: "name", title: "姓名", required: true, type: "text"}
    , {name: "idcard", title: "身份证", required: true, type: "text"}
    , {name: "phone", title: "手机号", required: true, type: "text"}
    ,	{name: "email", title: "电子邮箱", type: "email"}
    ,	{name: "male", title: "性别", value:function(me){
      if(me.male) {
        return "男"
      } else if(me.male == false) {
        return "女"
      } else {
        return "保密"
      }
    }, hide: true}
  ]
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }

  $scope.userSettingSave = function() {
    if ($scope.me["idcard"].length != 18)
      $scope.alert = { type: 'danger', msg: "请输入长度为18位的有效身份证号" };
    else if ($scope.me["phone"].length != 11)
      $scope.alert = { type: 'danger', msg: "请输入长度为11位的有效手机号" };
    else if ($scope.me["name"].length == 0)
      $scope.alert = { type: 'danger', msg: "姓名不能为空" };
    else {
      $scope.me.displayName = $scope.me.name;
      Users.save({userID:$scope.me.id}, $scope.me, function() {
        $scope.alert = { type: 'success', msg: "用户设定成功" };
        setTimeout(function(){$modalInstance.close();}, 500);
      }, function() {
        $scope.alert = { type: 'danger', msg: "用户设定失败" };
      })
    }
//    console.log($scope.me["idcard"].length)
  }
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
        setTimeout(function(){$modalInstance.close();}, 500);
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