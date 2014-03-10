function RegisterModalController($scope, $modalInstance, registerUser) {

  $scope.registerUser = registerUser;

  $scope.male = true;

  $scope.ok = function () {
    if ($scope.registerUser.username != "" &&
      $scope.registerUser.password != "" &&
      $scope.registerUser.displayName != "" ){
      $scope.registerUser.phone = $scope.registerUser.username;
      $modalInstance.close($scope.registerUser);
      console.log($scope.registerUser);
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};