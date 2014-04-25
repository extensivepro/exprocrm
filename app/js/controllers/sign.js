function SignController($scope, Users, $location, $modal, $cookies, $log, $timeout){
	$scope.loginUser = {
		username:"", password:""
	}
	$scope.Login = function() {
    $('input').checkAndTriggerAutoFillEvent();
		var user = $scope.loginUser;
		if(!user.username || user.username.length === 0 || !user.password || user.password.length === 0) {
      $scope.alert = { class: 'alert alert-danger', msg: "用户名或密码不能为空！" };
      $timeout(function () {
        $scope.alert = {};
      }, 2000);
      return;
    }
		Users.login(user, function(data){
			user = {username:"", password:""};
			$location.path('/main');
		},function(){
      $scope.alert = { class: 'alert alert-danger', msg: "用户名或密码不正确！" };
      $timeout(function () {
        $scope.alert = {};
      }, 2000);
		});
	};
  $scope.openRegModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'regModal.html',
      controller: ModalRegCtrl,
      resolve: {
      }
    });

    modalInstance.result.then(function (user) {
      Users.login(user, function(data){
        $location.path('/main');
      },function(){
        $scope.alert = { class: 'alert alert-danger', msg: "登录失败，请联系管理员！" };
        $timeout(function () {
          $scope.alert = {};
        }, 2000);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}
var ModalRegCtrl = function ($scope, $modalInstance, $timeout, Users) {
  $scope.regUser = {};
  $scope.alertReg = {
    class:'alert alert-danger',
    msg:''
  };
  var idcardRex = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  var phoneRex = /^1\d{10}$/;
  $scope.ok = function () {
    if ($scope.check()) {
      var obj = {
        username: $scope.regUser.username,
        password: $scope.regUser.password,
        idcard: $scope.regUser.idcard,
        name: $scope.regUser.username,
        displayName: $scope.regUser.username,
        phone:$scope.regUser.username
      };
      Users.save(obj, function (result) {
        var tempUser = {
          username: obj.username,
          password: obj.password
        };
        $modalInstance.close(tempUser);
      }, function (err) {
        console.log('err:\n', err);
        if (err.data && err.data.errors && (err.data.errors.username == 'is already in use')) {
          $scope.alertReg.msg = '用户名已经被占用！';
          showAlert();
        } else {

        }
      });
      return;
    } else {
      return;
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.check = function () {
    var user = $scope.regUser;
    var alert = $scope.alertReg;
    if (!user.username) {
      alert.msg = '用户名不能为空！';
      showAlert();
      return false;
    } else if (!user.idcard) {
      alert.msg = '身份证号不能为空！';
      showAlert();
      return false;
    } else if (!user.password || !user['password_r']) {
      alert.msg = '密码不能为空！';
      showAlert();
      return false;
    } else if (user.password != user['password_r']) {
      alert.msg = '两次密码输入不一致！';
      showAlert();
      return false;
    } else if (!phoneRex.test(user.username)) {
      alert.msg = '用户名必须是手机号码！';
      showAlert();
      return false;
    }else if (!idcardRex.test(user.idcard)) {
      alert.msg = '身份证号码填写有误！';
      showAlert();
      return false;
    } else {
      return true;
    }
  }
  function showAlert () {
    $timeout(function () {
      $scope.alertReg.msg = '';
    }, 2000);
  }
};