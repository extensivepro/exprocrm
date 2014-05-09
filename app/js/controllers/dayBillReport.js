/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-9
 */
function DayBillReportController($scope, Bills, Statistics, Pagination, $timeout, $injector) {
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Bills;
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.init = function () {
    var d = new Date();
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
    })
    $scope.params['createdAt'] = obj;
    $scope.countQs['createdAt'] = obj;
    var param = {
      keyID: $scope.currentMerchant.merchant.id,
      end: $scope.end*1000/86400000,
      start: $scope.start*1000/86400000,
      target: 'bills',
      limit: 10000,
      period: 'daily'
    }
    Statistics.query(param, function(result){
      if (result.length) {
        $scope.sales = result[0].value.sale;
        $scope.sales.total = $scope.sales.total/100;
        $scope.returns = result[0].value['return'];
      }
    })
    
  };
  $scope.fields = [
    {name: "billNumber", title: "账单号"},
    {name: "discountAmount", title: "折扣数", value: function (entity) {
      return (entity.discountAmount/100).toFixed(2);
    }},
    {name: "memberSettlement", title: "顾客", value:function(entity) {
      if (!entity.hasOwnProperty('memberSettlement')) {
        return "";
      } else if (entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
        return entity.memberSettlement.payeeAccount.name;
      } else if (entity.memberSettlement.hasOwnProperty('payerAccount')){
        return entity.memberSettlement.payerAccount.name;
      } else {
        return "";
      }
    }},
    {name: "amount", title: "消费金额", value:function(entity) {
      if (entity.dealType == 'deal' || entity.dealType == 'writedown') {
        return parseInt(entity.amount)/100*(-1).toFixed(2);
      }
      else {
        return '+' + (entity.amount/100).toFixed(2);
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

  $scope.getData = function () {
  }
}