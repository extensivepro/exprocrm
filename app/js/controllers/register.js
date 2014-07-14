function RegisterController($scope, $location) {
  var steps = [
    {title: '用户注册', view:'views/user/signup.html', active:true}
    , {title: '收银终端登记', view:'views/devices/register.html', active:false}
  ]
  $scope.steps = steps
  $scope.activeStep = 0
  
  $scope.nextStep = function () {
    $scope.activeStep++
    if($scope.activeStep < steps.length) {
      var step = steps[$scope.activeStep]
      step.active = true
      $scope.activeStepView = step.view
      $scope.steps = steps
    } else {
      $location.path('/main')
    }
  }
  
  $scope.cancelEdit = function () {
    $location.path('/home')
  }
  
  $scope.init = function () {
    var qs = $location.search()
    $scope.activeStep = qs.step || 0
    for (var i = qs.step; i >= 0; i--) {
      steps[i].active = true
    }
    $scope.activeStepView = $scope.steps[$scope.activeStep].view
  }
}