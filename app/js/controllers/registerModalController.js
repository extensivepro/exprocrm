function RegisterModalController($scope, $modalInstance, registerUser) {

  $scope.registerUser = registerUser;

  $scope.male = true;

  $scope.ok = function () {
    if ($scope.registerUser.username != "" &&
      $scope.registerUser.password != "" &&
      $scope.registerUser.name != "") {
      $scope.registerUser.phone = $scope.registerUser.username;
      $scope.registerUser.displayName = $scope.registerUser.name;
      $scope.registerUser.roles = "owner";
      if (validate($scope.registerUser) == true) {
        $modalInstance.close($scope.registerUser);
        console.log($scope.registerUser);
      }
    }
  };

  function validate (registerUser) {
    var usernameReg = RegExp("[a-zA-Z]");
    if (usernameReg.test(registerUser.username) == true ||
      $scope.registerUser.username.toString().length != 11){
      $scope.userNameErrMess = "请输入11位手机号"
      return false;
    }else
      $scope.userNameErrMess = ""
    if ($scope.registerUser.password.toString().length < 6){
      $scope.passwordErrMess = "密码不能少于6位"
      return false;
    }else
      $scope.passwordErrMess = ""
      
    if (registerUser.name.toString().length == 0) {
      return false;
    }

    if (registerUser.idcard.toString().length != 0)
      if (usernameReg.test(registerUser.idcard) == true ||
        $scope.registerUser.idcard.toString().length != 18) {
        $scope.idcardErrMess = "请输入18位身份证号"
        return false;
      } else
        $scope.idcardErrMess = ""
    if ($scope.registerUser.password != $scope.registerUser.repassword){
      $scope.repasswordErrMess = "两次密码输入不一致";
      return false;
    }else
      $scope.repasswordErrMess = "";
    return true;
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};