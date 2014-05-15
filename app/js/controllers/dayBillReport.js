/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-9
 */
function DayBillReportController($scope, Bills, Deals, Items, Statistics, Pagination, $timeout, $injector) {
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
        weixin:0
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
        end: $scope.end*1000/86400000,
        start: $scope.start*1000/86400000,
        limit: 10000,
        period: 'daily'
      };
      var paramForBill = angular.copy(param);
      paramForBill.target = 'bills';
      var paramForCash = angular.copy(param);
      paramForCash.target = 'cashes';
      var paramProfit = angular.copy(param);
      paramProfit.target = 'profits';
      // 获得营业额数据
      Statistics.query(paramForBill, function(result){
        if (result.length) {
          $scope.sales = result[0].value.sale;
          $scope.sales.total = $scope.sales.total/100;
          $scope.returns = result[0].value['return'];
          $scope.returns.total = $scope.returns.total/100;
        }
      });
      // 获得现金流数据
      Statistics.query(paramForCash, function(result){
        if (result.length) {
          $scope.cash  = {
            cash: result[0].value.cash/100,
            weixin: result[0].value.weixin/100
          };
        }
      });
      // 获得利润数据
      var shopIDs = JSON.stringify({
        "$in": $scope.currentMerchant.merchant.shopIDs||[]
      });
      var paramForProfit = {
        shopID: shopIDs,
        createdAt: obj
      };
      Deals.query(paramForProfit, function (results) {
        if (!results.length) {
          return;
        }
        var itemArr = [];
        for (var v = 0; v < results.length; v++) {
            itemArr.push(results[v].items);
        }
        var allItem = []; //当天交易的所有商品信息
        for (var x = 0; x < itemArr.length; x++) {
          var items = itemArr[x];
          for (var y = 0; y < items.length; y++) {
            allItem.push(items[y]);
          }
        }
        var ids = []; // 找出所有商品的id
        allItem.forEach(function (item, index) {
          if (ids.indexOf(item.item.id) == -1) {
            ids.push(item.item.id);
          }
        });
        var allItemObj = {}; // 重构当天卖的所有商品为一个对象，key是商品的‘id’，value是个数组，存放着所有商品id为‘id’的商品
        for(var a = 0; a < ids.length; a++) {
          var c = ids[a];
          allItemObj[c] = [];
          allItem.forEach(function (item) {
            if (c == item.item.id) {
              allItemObj[c].push(item);
            }
          });
        };

        var paramForItem = { // 用于查商品的参数
          '$limit': 1000000 // dpd端做了限制，如果不加limit参数，dpd最多返回10条记录
        };
        paramForItem['id'] = JSON.stringify({
            "$in": ids
        });
        Items.query(paramForItem, function (result) { // 从items中获得当天所卖所有商品的信息
          var uniqueItem = []; // 重构result，将其拆分成一个数组。
          result.forEach(function (r) {
            var obj = {}; // 数组的元素是对象，对象的key是商品的id，对象的value是商品的itemSkus属性
            obj[r.id] = {
              itemSkus: r.itemSkus
            };
            uniqueItem.push(obj);
          });
          var totalProfit = 0; // 初始化当天的总利润
          for (var c = 0; c < uniqueItem.length; c++) {  //遍历重构后的所有商品
            var d = uniqueItem[c];
            var fold = d[Object.keys(d)[0]].itemSkus.fold; // 取出当前商品的成本价(fold)
            var id =  Object.keys(d)[0]; // 取出当前商品的id
            var currItemArrs = allItemObj[id]; // 根据上面的id找到当天销售的商品
            currItemArrs.forEach(function (currItemArr) {
              totalProfit += (((currItemArr.dealPrice - fold)/100)*currItemArr.quantity); //单笔交易的利润=该商品数量*该商品的利润
            });
          }
          $scope.profit = totalProfit;
        }, function (err) {
          console.log('err:\n', err);
        });
      }, function (err) {
        console.log('err:\n', err);
      })
    }
  });




  $scope.fields = [
    {name: "billNumber", title: "账单号"},
    {name: "discountAmount", title: "折扣金额", value: function (entity) {
      return (entity.discountAmount/100).toFixed(2);
    }},
    {name: "memberSettlement", title: "顾客", value:function(entity) {
      if (entity.memberSettlement) {
        var m = entity.memberSettlement;
        var p = m.payerAccount || m.payeeAccount;
        return p.name;
      } else {
        return '走入顾客';
      }
    }},
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