function SignController($scope, Users, $location, $modal, $cookies, $log, $timeout, Merchants){
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
        if (!merchants.length) { // 检测出该用户还未创建过商户，则禁止进入主页面，转而显示新建商户modal。
          $scope.meLogin = user; // 将当前登录的用户名和密码保存起来，用以创建完商户和商店后登录使用
          $scope.showCreateMerchantModal(data, true); //data：登录后服务器返回的用户详情；true:用于标识‘新建商户模态框’是因为登录时检测出这个用户还没有商户。
        } else {
          $location.path('/main'); // 已经有商户则直接进入主页面
        }
      });
		},function(){
      $scope.alert = { "class": 'alert alert-danger', msg: "用户名或密码不正确！" };
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
    modalInstance.result.then(function (me) {
      $scope.meLogin = { // 登录所需的用户名和密码
        username: me.username,
        password: me.password
      };
      delete me.password;
      $scope.meProfile = me; // 创建商户时的owner
      Users.login($scope.meLogin, function(data){
        $scope.showCreateMerchantModal($scope.meProfile);
      },function(){
        console.log('err:\n', err);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

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

function AuthController($scope, $http, Users, $location) {
  $scope.init = function () {
    console.log('==========',$location.search())
    // $location.search({})
    // $http.defaults.headers.common['cookies']= 'sid=413bd4800e15714dd387a57cfd9d554f6ea8eabb65597308423721fca2a995e6293b79f5d077b757807f18a8648a2a324e43780c2161f3fdfa4897d0fb398a71'
    Users.me(function () {
      $location.path('/main')
    }, function (httpResponse) {
      console.log('Error:', httpResponse)
    })
  }
}

// 注册界面模态框控制器
var ModalRegCtrl = function ($scope, $modalInstance, $timeout, Users) {
  $scope.regUser = {};
  $scope.alertReg = {
    "class":'alert-danger',
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
        phone:$scope.regUser.username,
        male: true
      };
      Users.save(obj, function (me) {
        me.password = obj.password;
        $modalInstance.close(me);
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