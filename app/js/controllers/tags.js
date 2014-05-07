/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-24
 */
function TagsController($scope, $timeout, Merchants, $modal, $log){
  $scope.itemTags = [];
  $scope.init = function () {
    var obj = {
      id: $scope.currentMerchant.merchant.id
    }
    Merchants.get(obj, function (result) {
      $scope.itemTags = result.itemTags || [];
    }, function (err) {
      console.log('err:\n', err);
    })
  };

  $scope.editTag = function (name) {
    var modalInstance = $modal.open({
      templateUrl: 'modalEditTag.html',
      controller: ModaEditTagCtrl,
      resolve: {
        name: function () {
          return name;
        }
      }
    });
    modalInstance.result.then(function (newTag) {
      var index = $scope.itemTags.indexOf(name);
      $scope.itemTags[index] = newTag;
      var obj = {
        "id": $scope.currentMerchant.merchant.id,
        "itemTags": $scope.itemTags
      };
      Merchants.update(obj, function (result) {
        $scope.init();
      }, function (err) {
        console.log('err:\n', err);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.deleteTag = function (name) {
    var obj = {
      "id": $scope.currentMerchant.merchant.id,
      "itemTags": {$pull: name}
    };
    Merchants.update(JSON.stringify(obj), function (result) {
      $scope.init();
    }, function (err) {
      console.log('err:\n', err);
    });
  }
  $scope.createTag = function () {
    var modalInstance = $modal.open({
      templateUrl: 'modalAddTag.html',
      controller: ModaCreateTagCtrl,
      resolve: {
        itemTags: function () {
          return $scope.itemTags;
        }
      }
    });
    modalInstance.result.then(function (newTag) {
      var obj = {
        "id": $scope.currentMerchant.merchant.id,
        "itemTags": {$push: newTag}
      };
      Merchants.update(JSON.stringify(obj), function (result) {
        $scope.init();
      }, function (err) {
        console.log('err:\n', err);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}

var ModaCreateTagCtrl = function ($scope, $modalInstance,itemTags) {
  $scope.tag = {
    name:''
  };
  $scope.ok = function () {
    var flag = true;
    itemTags.forEach(function (tag) {
      if (tag == $scope.tag.name) {
        flag = false;
        alert('创建失败，标签名重复');
        return;
      }
    });
    if (!$scope.tag.name) {
      alert('标签名不能为空');
    } else if(flag) {
      $modalInstance.close($scope.tag.name);
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
var ModaEditTagCtrl = function ($scope, $modalInstance, name) {
  $scope.tag = {
    name:name
  }
  $scope.ok = function () {
    if ($scope.tag.name) {
      $modalInstance.close($scope.tag.name);
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};