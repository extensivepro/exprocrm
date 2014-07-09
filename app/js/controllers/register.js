function RegisterController($scope, $location, $timeout, Devices, DeviceRegister, Users) {
  $scope.regUser = {}
  $scope.errorMsg = ""
  $scope.registerFields = [
    {key: "username", title: "用户名", placeholder:"请输入您的手机号", type:"text", iStatus:"fa-question"}
    , {key: "password", title: "密码", placeholder:"请输入密码", type:"password", iStatus:"fa-question"}
    , {key: "password2", title: "确认密码", placeholder:"请输入与上面相同的密码", type:"password", iStatus:"fa-question"}
    , {key: "idcard", title: "身份证号码", placeholder:"请输入您的身份证号码", type:"text", iStatus:"fa-question"}
    , {key: "serialnumber", title: "设备序列号", placeholder:"请输入您的设备序列号", type:"text", iStatus:"fa-question"}
  ]
  
  
  var idcardRex = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  var phoneRex = /^1\d{10}$/;
  $scope.register = function () {
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
  
  $scope.goLogin = function () {
    $location.path('/home')
  }
  
  $scope.validate = function (index) {
    var field = $scope.registerFields[index]
    console.log($scope.regUser[field.key])
    if(!$scope.regUser[field.key] || $scope.regUser[field.key] === '') {
      field.iStatus = "fa fa-times-circle fa-lg"
      showAlert(field.title + "不能为空！")
    } else {
      field.iStatus = "fa fa-spinner fa-spin fa-lg"
      if (field.key === 'serialnumber') {
        Devices.query({udid:$scope.regUser.serialnumber}, function (devices) {
          if(devices.length > 0 ) {
            var device = devices[0]
            if(device.shop && device.shop.merchant.id === $scope.currentMerchant.id) {
              field.iStatus = "fa fa-times-circle fa-lg"
              showAlert("您已经注册过该设备，不需要重复注册！")
            } else {
              field.iStatus = "fa fa-check-circle fa-lg"
              $scope.registerOptions.device = devices[0]
              $scope.regUser.code = devices[0].code
              $scope.regUser.name = devices[0].name
            }
          } else {
            field.iStatus = "fa fa-times-circle fa-lg"
            showAlert('系统没找到您提供的设备序列号，请确认输入是正确的序列号！')
          }
        })
      }
  } 
    var user = $scope.regUser;
    if (!user.username) {
      showAlert('用户名不能为空！')
    } else if (!phoneRex.test(user.username)) {
      showAlert('用户名必须是正确的手机号码！');
    } else if (!user.password || !user['password_r']) {
      showAlert('密码不能为空！');
    } else if (user.password != user['password_r']) {
      showAlert('两次密码输入不一致！');
    } else if (!user.idcard) {
      showAlert('身份证号不能为空！');
    } else if (!idcardRex.test(user.idcard)) {
      showAlert('身份证号码填写有误！');
    } else if (!$scope.deviceSerialNumber) {
      showAlert('设备序列号不能为空')
    } else {
      return true;
    }
    return false;
  }
  
  function showAlert (msg) {
    $scope.errorMsg = msg
    $timeout(function () {
      $scope.errorMsg = ''
    }, 2000)
  }

  $scope.init = function () {
    var querystring = $location.search()
    $scope.regUser.serialnumber = querystring.serialnumber || ''
  }
}