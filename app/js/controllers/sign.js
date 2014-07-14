function SigninController($scope, Users, $location, $modal, $cookies, $log, $timeout, Merchants){
	$scope.loginUser = {
		username:"", password:""
	}

	$scope.Login = function() {
    $('input').checkAndTriggerAutoFillEvent();
		var user = $scope.loginUser;
		if(!user.username || user.username.length === 0 || !user.password || user.password.length === 0) {
      $scope.alert = { "class": 'alert alert-danger', msg: "用户名或密码不能为空！" };
      $timeout(function () {
        $scope.alert = {};
      }, 2000);
      return;
    }
		Users.login(user, function(data){
      Merchants.query({'owner.id':data.uid}, function (merchants) {
        if (!merchants.length) {
          var qs = $location.search()
          qs.step = 1
          $location.path('/register').search(qs)
        } else {
          $location.path('/main')
        }
      });
		},function(){
      $scope.alert = { "class": 'alert alert-danger', msg: "用户名或密码不正确！" };
      $timeout(function () {
        $scope.alert = {};
      }, 2000);
		});
	};

  $scope.goRegister = function () {
    var qs = $location.search()
    qs.step = 0
    $location.path('/register').search(qs)
  }

  $scope.showCreateMerchantModal = function (Me, flag) {
    var modalInstance = $modal.open({
       templateUrl: 'createMerchantModal.html',
       controller: ModalCreateMerchantCtrl,
       resolve: {
         msg: function () {
         return {
             me: Me,
             flag: flag
           }
         }
       }
      }
    );
    modalInstance.result.then(function (merchantID) {
      $scope.showCreateShopModal(merchantID);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.showCreateShopModal = function (merchantID) {
    var modalInstance = $modal.open({
      templateUrl: 'createShopModal.html',
      controller: ModalCreateShopCtrl,
      resolve: {
        MerchantID: function () {
          return merchantID
        }
      }
    });
    modalInstance.result.then(function () {
      Users.login($scope.meLogin, function (data) {
        $location.path('/main');
      }, function () {
        console.log('err:\n', err);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}

function SignupController($scope, $location, $timeout, Devices, DeviceRegister, Users) {
  $scope.regUser = {
    username:"13357828347",
    password:"123456",
    password2: "123456",
    idcard: "320103197912162012"
  }
  $scope.alert = {
    type: 'danger',
    msg:''
  }
  $scope.registerFields = [
    {key: "username", title: "用户名", placeholder:"请输入您的手机号", type:"text", iStatus:"fa-question"}
    , {key: "password", title: "密码", placeholder:"请输入密码", type:"password", iStatus:"fa-question"}
    , {key: "password2", title: "确认密码", placeholder:"请输入与上面相同的密码", type:"password", iStatus:"fa-question"}
  ]
  $scope.registerButtonIcon = "fa-pencil"
  
  $scope.register = function (callback) {
    $scope.registerButtonIcon = "fa-spinner fa-spin"
    if ($scope.check()) {
      var obj = {
        username: $scope.regUser.username,
        password: $scope.regUser.password,
        idcard: '320103197912162012',
        name: $scope.regUser.username,
        displayName: $scope.regUser.username,
        phone: $scope.regUser.username,
        male: true
      };
      Users.save(obj, function (me) {
        me.password = obj.password;
        Users.login(me, function () {
          $scope.registerButtonIcon = "fa-pencil"
          $scope.nextStep()
        }, function (err) {
          console.log(err)
          showAlert('用户登录失败，请重新登录后再尝试！')
          $timeout(function () {
            $location.path('/home')
          }, 3000)
        })
      }, function (err) {
        console.log('err:\n', err);
        if (err.data && err.data.errors && (err.data.errors.username == 'is already in use')) {
          showAlert('用户已经被注册过，请点击右下角返回登录界面登录！')
        } else {
          showAlert(err.data.errors)
        }
      })
    }
  }
  
  function validateResult(field, msg) {
    if(msg) {
      field.iStatus = "fa-times-circle"
      showAlert(msg)
      return false
    } else {
      field.iStatus = "fa-check-circle"
      return true
    }
  }
  
  $scope.validate = function (index) {
    var field = $scope.registerFields[index]
    if(!$scope.regUser[field.key] || $scope.regUser[field.key] === '') {
      return validateResult(field, field.title + "不能为空！")
    } else {
      if (field.key === 'username') {
        var phoneRex = /^1\d{10}$/
        if(!phoneRex.test($scope.regUser.username)) {
          return validateResult(field, '用户名必须是正确的手机号码！')
        }
      } else if (field.key === 'password2') {
        if($scope.regUser.password !== $scope.regUser.password2) {
          return validateResult(field, '两次密码输入不一致！')
        }
      // } else if (field.key === 'idcard') {
      //   var idcardRex = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
      //   if (!idcardRex.test($scope.regUser.idcard)) {
      //     return validateResult(field, '身份证号码填写不正确！')
      //   }
      }
      return validateResult(field)
    }
  }
  
  $scope.check = function () {
    var validated = true
    for (var i = $scope.registerFields.length - 1; i >= 0; i--) {
      var field = $scope.registerFields[i]
      if(field.iStatus !== 'fa-check-circle' && !$scope.validate(i)) {
        validated = false
      }
    }
    return validated
  }
  
  function showAlert (msg, type) {
    $scope.registerButtonIcon = "fa-pencil"
    $scope.alert.type = type || 'danger'
    $scope.alert.msg = msg
    return false
  }

}

// 新建商户模态框控制器
var ModalCreateMerchantCtrl = function ($scope, $modalInstance, $timeout, Merchants, msg) {
  $scope.regMerchant = {};
  console.log('msg:\n', msg);
  $scope.ok = function() {
    if (!$scope.check()) {
      return;
    }
    $scope.regMerchant.owner = msg.me;
    $scope.regMerchant['createdAt'] = Math.round(new Date().getTime() / 1000);
    var newOne = new Merchants($scope.regMerchant);
    newOne.$save(function(merchant) {
      $modalInstance.close(merchant.id);
    },function(err){
      showDpdAlert(err);
    });
  }
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.initErrContent = function () {
    $scope.errContent = { // errContent：用于展示错误消息的对象
      msg:''
    };
    if (msg.flag) {
      $scope.errContent.msg = '你尚未创建过商户，请先创建';
      return showAlert();
    } else {

      $scope.errContent.msg = '注册成功！';
      return showAlert();
    }
  }
  $scope.check = function () { // 校验新增
    var v = $scope.regMerchant;
    var m = $scope.errContent;
    if (!v.name) {
      m.msg = '商户简称不能为空';
      return showAlert();
    } else if (!v.fullName) {
      m.msg = '商户全称不能为空';
      return showAlert();
    } else if (!(/^\d{7,11}$/.test(v.telephone))) {
      m.msg = '号码格式不对，需为7~11数字';
      return showAlert();
    } else {
      return true;
    }
  };
  function showDpdAlert(err) { // 来自服务端的错误信息
    if (err.data) {
      if (err.data.message == 'merchant name exist') {
        $scope.errContent.msg = '此商户简称已被占用！';
        showAlert();
      } else if (err.data.message == 'merchant fullName exist') {
        $scope.errContent.msg = '此商户全称已被占用！';
        showAlert();
      }
    } else {
      console.log('err:\n', err);
    }
  }
  function showAlert() {
    $timeout(function () {
      $scope.errContent.msg = '';
    }, 2000);
    return false;
  }
};

// 新建商店模态框控制器
var ModalCreateShopCtrl = function ($scope, $modalInstance, $timeout, Shops, MerchantID) {
  $scope.regShop = {};
  $scope.ok = function() {
    if (!$scope.check()) {
      return;
    }
    var obj = {
      code:$scope.regShop.code,
      name:$scope.regShop.name,
      address:'',
      telephone: '',
      merchantID:MerchantID,
      status:'open',
      openRes:[],
      location:{
        latitude:0,
        longitude:0,
        precision:0
      },
      createdAt:Math.round(new Date().getTime() / 1000)
    };
    var newOne = new Shops(obj);
    newOne.$save(function(shop) {
      $modalInstance.close();
    },function(err){
      showDpdAlert(err);
    });
  }
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  $scope.initErrContent = function () {
    $scope.errContent = { // errContent：用于展示错误消息的对象
      msg:''
    };
  }
  $scope.check = function () { // 校验新增
    var v = $scope.regShop;
    var m = $scope.errContent;
    if (!v.code) {
      m.msg = '商店编码不能为空';
      return showAlert();
    } else if (!v.name) {
      m.msg = '商店名称不能为空';
      return showAlert();
    } else {
      return true;
    }
  };
  function showDpdAlert(err) { // 来自服务端的错误信息
    if (err.data) {
      if (err.data.message == 'exist code') {
        $scope.errContent.msg = '商店编码已被占用！';
        showAlert();
      }
    } else {
      console.log('err:\n', err);
    }
  }
  function showAlert() { // 2秒后错误消息消失，并返回false
    $timeout(function () {
      $scope.errContent.msg = '';
    }, 2000);
    return false;
  }
};