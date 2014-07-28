function DayBillReportController($scope, Bills, Deals, $modal, $log,  Items, Statistics, Pagination, $timeout, $injector) {
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Bills;
  $scope.initDate = function () {
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();
    $scope.clear = function () {
      $scope.dt = null;
    };
    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.formats = ['yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  };
  $scope.$watch('dt', function () {
    if ($scope.dt) {
      $scope.sales = {
        total:0,
        count:0
      };
      $scope.returns = {
        total:0,
        count:0
      };
      $scope.cash = {
        cash:0,
        online:0
      }
      $scope.profit = 0;
      var d = $scope.dt;
      var year = d.getFullYear();
      var month = d.getMonth();
      var date = d.getDate();
      var startDate = new Date(year, month, date);
      var endDate = new Date(year, month, date+1);
      $scope.start = Math.round(startDate.getTime() / 1000);
      $scope.end = Math.round(endDate.getTime() / 1000);
      var obj = JSON.stringify({
        '$gt':$scope.start+28800,
        '$lt':$scope.end+28800
      });
      $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
      $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
      $scope.params['createdAt'] = obj;
      $scope.countQs['createdAt'] = obj;
      $scope.refreshList();
      var param = {
        keyID: $scope.currentMerchant.merchant.id,
        end: parseInt($scope.end*1000/86400000, 10),
        start: parseInt($scope.start*1000/86400000, 10),
        period: 'daily'
      };
      var paramForBill = angular.copy(param);
      paramForBill.target = 'bills';
      Statistics.query(paramForBill, function(result){
        if (result.length) {
          $scope.sales = result[0].value.sale;
          $scope.sales.total = ($scope.sales.total/100).toFixed(2);
          $scope.returns = result[0].value['return'];
          $scope.returns.total = ($scope.returns.total/100).toFixed(2);
          $scope.cash  = {
            cash: (result[0].value.cashAmount/100).toFixed(2),
            online: (result[0].value.onlineAmount/100).toFixed(2)
          };
        }
      });

      var paramForProfit = angular.copy(param)
      paramForProfit.target = 'deals'
      paramForProfit.itemID = 'count'
      Statistics.query(paramForProfit, function(result){
        if (result.length) {
          $scope.profit = (result[0].value.profit/100).toFixed(2)
        }
      });
    }
  });

  $scope.showProfile = function (entity) {
    Deals.get({id: entity.dealID}, function (deal) {
      $scope.openRegModal(deal);
    }, function (err) {
      console.log('err:\n', err);
    });
  }
  $scope.openRegModal = function (deal) {
    var modalInstance = $modal.open({
      templateUrl: 'dealModal.html',
      controller: ModalShowDealsCtrl,
      resolve: {
        Deal: function () {
          return deal;
        }
      }
    });
    modalInstance.result.then(function (me) {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.fields = [
    {name: "billNumber", title: "账单号", value: function (entity) {
      return parseInt(entity.billNumber, 10);
    }},
    {name: "discountAmount", title: "折扣金额", value: function (entity) {
      return (entity.discountAmount/100).toFixed(2);
    }},/*
    {name: "memberSettlement", title: "顾客", value:function(entity) {
      if (entity.memberSettlement) {
        var m = entity.memberSettlement;
        var p = m.payerAccount || m.payeeAccount;
        return p.name;
      } else {
        return '走入顾客';
      }
    }},*/
    {name: "amount", title: "消费金额", value:function(entity) {
      var type = entity.dealType;
      if (type == 'prepay' || type == 'deal') {
        return ('+') + ((parseInt(entity.amount)- parseInt(entity.discountAmount))/100).toFixed(2);
      }
      else if(type == 'return' || type == 'writedown'){
        return '-' + ((parseInt(entity.amount)- parseInt(entity.discountAmount))/100).toFixed(2);
      }
    }},
    {name: "agentName", title: "经手人"},
    {name: "createdAt", title: "日期"},
    {name: "dealType", title: "交易类型",value:function(entity) {
      var type = entity.dealType;
      entity.fieldClass = entity.fieldClass || {}
      if (type == 'deal') {
        entity.fieldClass.dealType = "label label-success";
        return '付款';
      } else if (type == 'prepay') {
        entity.fieldClass.dealType = "label label-info";
        return  '充值';
      } else if (type == 'return') {
        entity.fieldClass.dealType = "label label-warning";
        return '退款';
      } else if (type == 'writedown') {
        entity.fieldClass.dealType = "label label-danger";
        return '冲减';
      }
    }}
  ];
}
var ModalShowDealsCtrl = function ($scope, $modalInstance, Deal) {
  $scope.deal = Deal;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};