function DashboardController($scope, Statistics, Shops, Items) {
  $scope.saleNum = 0.0
  $scope.totalCash = 0.0
  $scope.skusNum = 0.0

  //controller initialization
  $scope.$watch('currentMerchant.merchant', function () {
    if ($scope.currentMerchant.merchant['address']) {
      $scope.init();
      $scope.getCash();
    }
  })

  $scope.$watch('saleParam.keyID', function () {
    if ($scope.saleParam.keyID != undefined) {
      saleFetch();
      shopSaleFetch();
      itemSaleFetch();
    }
    if ($scope.skusParam.keyID != undefined)
      skusFetch();
  })

  function basicChartInit() {
    var chart = {};
    chart.type = 'BarChart';
    chart.displayed = true;
    chart.cssStyle = "height:350px; width:100%;text-align: right;";
    chart.data = {"cols": [
      {id: "shopName", label: "店名", type: "string"},
      {id: "sales", label: "销售", type: "number"}
    ], "rows": []};
    chart.options = {
      "legend": 'none',
      "isStacked": "false",
      "fill": 50,
      "displayExactValues": true,
      "vAxis": {
        "title": "商店名称",
        "maxAlternation": 1,
        "slantedText": false,
        "titleTextStyle": {italic: false, bold: true}
      },
      "hAxis": {
        "title": "销售额(元)",
        "gridlines": {"count": 10},
        "maxAlternation": 1,
        "slantedText": false,
        "baseline": 0,
        "titleTextStyle": {italic: false, bold: true}
      }
    };
    return chart
  }

  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  function itemSaleFetch(){
    Items.query({merchantID: $scope.currentMerchant.merchant.id, '$fields': {id: 1, merchantID: 1, name: 1}}, function (result){
      var chart = basicChartInit();
      var itemIDs = [];
      result.forEach(function (item) {
        itemIDs.push(item.id);
        $scope.itemHashMap.Set(item.id, item.name);
      })
      var param = {
        keyID: $scope.currentMerchant.merchant.id,
        itemID: itemIDs,
        end: Statistics.until(new Date(), 'daily'),
        start: Statistics.until(new Date(), 'daily') - 2,
        target: 'deals',
        limit: 10000,
        period: 'daily'
      }
      Statistics.query(param, function(result){
       console.log(result);
        var itemData = [];
        var rows = [];
        result.forEach(function(item){
          var itemDatium = {
            name: $scope.itemHashMap.Get(item.value.itemID),
            sumPrice: Number((item.value.sumPrice / 100).toFixed(1))
          };
          itemData.push(itemDatium);
        })
        itemData = sortByKey(itemData, 'sumPrice');
        var limit = itemData.length >=5 ? 5 : itemData.length;
        for (var i = 0; i < limit; i ++){
          rows.push({
            'c': [
              {'v': itemData[i].name},
              {'v': itemData[i].sumPrice, 'f': itemData[i].sumPrice+ ' 元'}
            ]
          });
        }
        chart.data.rows = rows;
        $scope.itemChart = chart;
      })
    })
  }

  function shopSaleFetch(){
    Shops.query({merchantID: $scope.currentMerchant.merchant.id, '$fields': {id: 1, merchantID: 1, name: 1}}, function (result){
//      console.log(result);
      var chart = basicChartInit();
      var keyIDs = [];
      result.forEach(function(item){
        $scope.shopHashMap.Set(item.id, item.name);
        keyIDs.push(item.id);
      })
      var param = {
        keyID: keyIDs,
        period: 'daily',
        end: Statistics.until(new Date(), 'daily'),
        start: Statistics.until(new Date(), 'daily') - 1,
        target: 'bills',
        limit: 2
      }
      Statistics.query(param, function (result) {
//        console.log(result);
        var shopData = []
        var rows = [];
        result.forEach(function (item) {
          var shopDatium = {
            name: $scope.shopHashMap.Get(item.value.keyID),
            total: Number((item.value.sale.total / 100).toFixed(1))
          };
          shopData.push(shopDatium);
        })
        shopData = sortByKey(shopData, 'total');
        var limit = shopData.length >= 5 ? 5 : shopData.length;
          for (var i = 0; i < limit; i ++) {
            rows.push({
              'c': [
                {'v': shopData[i].name},
                {'v': shopData[i].total, 'f': shopData[i].total + ' 元'}
              ]
            });
          }
          chart.data.rows = rows;
          $scope.shopChart = chart;
      })
    })
  }

  function saleFetch(){
    Statistics.query($scope.saleParam, function (result) {
      if (result.length == 2){
        $scope.saleNum = numberWithCommas(Number(result[0].value.sale.total / 100).toFixed(1));
        $scope.saleNumPrv = numberWithCommas(Number(result[1].value.sale.total / 100).toFixed(1));
        $scope.saleDiffSign = (100 * ($scope.saleNum - $scope.saleNumPrv) / $scope.saleNumPrv).toFixed(1);
        $scope.saleDiff = Math.abs($scope.saleDiffSign);
      } else if (result.length == 1) {
        if (result[0].value.statAt == $scope.saleParam.start) {
          $scope.saleNum = numberWithCommas(Number(result[0].value.sale.total / 100).toFixed(1));
          $scope.saleDiffSign = 'na';
          $scope.saleDiff = '好的开始是成功的一半'
        }else if (result[0].value.statAt == $scope.saleParam.end) {
          $scope.saleNum = 0;
          $scope.saleDiffSign = -100;
          $scope.saleDiff = 100;
        }
      }else if (result.length == 0){
        $scope.saleNum = 0;
        $scope.saleDiffSign = -100;
        $scope.saleDiff = 100;
      }
    })
  }

  function skusFetch() {
    Statistics.query($scope.skusParam, function(result) {
      if (result.length != 0) {
        var skusTotal = 0;
        result.forEach(function (item) {
          skusTotal += item.value.sumPrice;
        })
        $scope.skusNum = numberWithCommas((skusTotal / 100).toFixed(1));
      } else if (result.length == 0) {
        $scope.skusNum = 0;
      }
    })
  }

  function saleParamInit(keyID) {
    $scope.saleParam = {
      keyID: keyID,
      period: 'daily',
      end: Statistics.until(new Date(), 'daily') ,
      start: Statistics.until(new Date(), 'daily') - 2,
      target: 'bills',
      limit: 2
    }
  }

  function skusParamInit(keyID) {
    $scope.skusParam = {
      keyID: keyID,
      period: 'daily',
      end: Statistics.until(new Date(), 'daily') ,
      start: Statistics.until(new Date(), 'daily') - 2,
      target: 'skus',
      type: 'add',
      limit: 10000
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $scope.chartReady = function () {
    fixGoogleChartsBarsBootstrap();
  }
  function fixGoogleChartsBarsBootstrap() {
    $(".google-visualization-table-table img[width]").each(function (index, img) {
      $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
    });
  }

  $scope.init = function () {
    $scope.shopHashMap = {
      Set : function(key,value){this[key] = value},
      Get : function(key){return this[key]},
      Contains : function(key){return this.Get(key) == null?false:true},
      Remove : function(key){delete this[key]}
    };
    $scope.itemHashMap = {
      Set : function(key,value){this[key] = value},
      Get : function(key){return this[key]},
      Contains : function(key){return this.Get(key) == null?false:true},
      Remove : function(key){delete this[key]}
    };
    saleParamInit($scope.currentMerchant.merchant.id);
    skusParamInit($scope.currentMerchant.merchant.id);
    $scope.cashFlowNum = numberWithCommas($scope.saleParam.end);
    $scope.cashFlowBlk = true;
    $scope.shopChart = basicChartInit()
    $scope.itemChart = basicChartInit()
    widthFunctions();
  };
  $scope.getCash = function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    var startDate = new Date(year, month, date);
    var endDate = new Date(year, month, date+1);
    $scope.start = Math.round(startDate.getTime() / 1000);
    $scope.end = Math.round(endDate.getTime() / 1000);
    var param = {
      keyID: $scope.currentMerchant.merchant.id,
      end: $scope.end*1000/86400000,
      start: $scope.start*1000/86400000,
      limit: 10000,
      period: 'daily'
    };
    var paramForCash = angular.copy(param);
    paramForCash.target = 'cashes';
    // 获得现金流数据
    $scope.totalCash = 0;
    Statistics.query(paramForCash, function(result){
      if (result.length) {
        $scope.totalCash = ((result[0].value.cash/100) + (result[0].value.weixin/100)).toFixed(1);
      }
    });
  }
}
