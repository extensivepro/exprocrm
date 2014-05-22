/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-22
 */
function PointRulesController($scope, Merchants, $timeout) {
  var idObj = {merchantID: $scope.currentMerchant.merchant.id};
  $scope.master = {};
  $scope.reset = function () {
    angular.copy($scope.master, $scope.pointRule);
  }
  $scope.init = function () {
    $scope.errContent = {
      msg:'',
      alertClass:''
    };
    Merchants.get(idObj, function (merchant) {
      if (!merchant.pointRule) {
        var pointRule = {
          "newMember": {
            "type": "fixed",
            "amount": "100"
          },
          "consumption": {
            "type": "ratio",
            "ratio": "1"
          },
          "referrer": {
            "type": "fixed",
            "amount": "100"
          }
        }
        Merchants.update(idObj, {pointRule: pointRule}, function (merchant) {
          $scope.init();
        }, function (err) {
          console.log('err:\n', err);
        });
      } else {
        $scope.pointRule = merchant.pointRule;
        $scope.master = angular.copy($scope.pointRule);
      }
    }, function (err) {
      console.log('err:\n', err);
    })
  };
  $scope.updateRule = function () {
    Merchants.update(idObj, {pointRule: $scope.pointRule}, function (merchant) {
      $scope.pointRule = merchant.pointRule;
      $scope.master = angular.copy($scope.pointRule);
      $scope.errContent = {
        msg:'更新成功',
        alertClass: 'alert alert-success'
      };
      $scope.closeAlert();
    }, function (err) {
      console.log('err:\n', err);
      $scope.errContent = {
        msg:'更新失败',
        alertClass: 'alert alert-danger'
      };
      $scope.closeAlert();
    });
  }
  $scope.closeAlert = function () {
    $timeout(function () {
      $scope.errContent = {
        msg:'',
        alertClass:''
      };
    }, 3000);
  }
}