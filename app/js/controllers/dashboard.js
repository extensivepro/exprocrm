function DashboardController($scope, Statistics, Shops, Items) {
  $scope.saleNum = 0.0
  $scope.totalCash = 0.0
  $scope.skusNum = 0.0
  $scope.profit = 0.0

  $scope.shopChartConfig = {
    title: '当日门店销售额排行',
    tooltips: true,
    labels: true,
    // mouseover: function() {},
    // mouseout: function() {},
    // click: function() {},
    legend: {
      display: true,
      position: 'right'
    }
  }

  $scope.shopChartData = {
    series: ['销售额', '退单额', '储值额'],
    data: []
  }

  $scope.shopChartConfig2 = {
    title: '当日门店销量售排行',
    tooltips: true,
    labels: true,
    legend: {
      display: true,
      position: 'right'
    }
  }

  $scope.shopChartData2 = {
    series: ['销量', '退单量', '储值次数'],
    data: []
  }

  $scope.itemChartConfig = {
    title: '当日单品销售额排行',
    tooltips: true,
    labels: true,
    legend: {
      display: true,
      position: 'right'
    }
  }

  $scope.itemChartData = {
    series: ['销售额', '毛利润'],
    data: []
  }
  
  $scope.itemChartConfig2 = {
    title: '当日单品销量排行',
    tooltips: true,
    labels: true,
    legend: {
      display: true,
      position: 'right'
    }
  }

  $scope.itemChartData2 = {
    series: ['销量', '销售单数'],
    data: []
  }
  
  //controller initialization
  $scope.$watch('currentMerchant.merchant', function () {
    if ($scope.currentMerchant.merchant['address']) {
      $scope.init();
    }
  })

  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  function itemSaleFetch(){
    Items.query({merchantID: $scope.currentMerchant.merchant.id, '$fields': {id: 1, merchantID: 1, name: 1}}, function (result){
      var itemIDs = result.map(function (item) {
        $scope.itemHashMap.Set(item.id, item.name)
        return item.id
      })
      var param = {
        keyID: $scope.currentMerchant.merchant.id,
        itemID: itemIDs,
        end: Statistics.until(new Date(), 'daily'),
        start: Statistics.until(new Date(), 'daily') - 1,
        target: 'deals',
        sort: { "value.sumPrice": -1 },
        limit: 5,
        period: 'daily'
      }
      Statistics.query(param, function(result){
        // console.log(result);
        result.forEach(function(item){
          var itemDatium = {
            x: $scope.itemHashMap.Get(item.value.itemID),
            y: [
              Number((item.value.sumPrice / 100).toFixed(1)),
              parseInt(item.value.profit/100, 10)
            ]
          }
          $scope.itemChartData.data.push(itemDatium);
        })
      })
      var param2 = angular.copy(param)
      param2.sort = { "value.quantity": -1}
      Statistics.query(param2, function(result){
        // console.log(result);
        result.forEach(function(item){
          var itemCount = {
            x: $scope.itemHashMap.Get(item.value.itemID),
            y: [item.value.quantity, item.value.count]
          }
          $scope.itemChartData2.data.push(itemCount);
        })
      })
    })
  }

  function shopSaleFetch(){
    Shops.query({merchantID: $scope.currentMerchant.merchant.id, '$fields': {id: 1, merchantID: 1, name: 1}}, function (shops){
      // console.log(shops);
      var keyIDs = [];
      shops.forEach(function(item){
        $scope.shopHashMap.Set(item.id, item.name);
        keyIDs.push(item.id);
      })
      var param = {
        keyID: keyIDs,
        period: 'daily',
        end: Statistics.until(new Date(), 'daily'),
        start: Statistics.until(new Date(), 'daily') - 1,
        target: 'bills',
        sort: {"value.sale.total": -1},
        limit: 5
      }
      Statistics.query(param, function (result) {
        // console.log(result);
        result.forEach(function (item) {
          var shopDatium = {
            x: $scope.shopHashMap.Get(item.value.keyID),
            y: [
              parseInt(item.value.sale.total/100, 10), 
              parseInt(item.value.return.total/100, 10), 
              parseInt(item.value.prepay.total/100, 10)
            ]
          }
          $scope.shopChartData.data.push(shopDatium)
          var shopCount = {
            x: $scope.shopHashMap.Get(item.value.keyID),
            y: [
              item.value.sale.count, 
              item.value.return.count, 
              item.value.prepay.count
            ]
          }
          $scope.shopChartData2.data.push(shopCount)
        })
      })
    })
  }

  var statParam = {
    period: 'daily',
    end: Statistics.until(new Date(), 'daily') ,
    start: Statistics.until(new Date(), 'daily') - 1,
    limit: 1
  }
  
  function statMerchantSale(){
    var saleParam = angular.copy(statParam)
    saleParam.target = 'bills'
    Statistics.query(saleParam, function (result) {
      if(result.length > 0) {
        $scope.saleNum = numberWithCommas(Number(result[0].value.sale.total / 100).toFixed(0))
        $scope.totalCash = numberWithCommas(((result[0].value.cashAmount+result[0].value.onlineAmount)/100).toFixed(2))
      } else {
        $scope.saleNum = 0
        $scope.totalCash = 0
      }
    })
  }

  function statMerchantSku() {
    var skusParam = angular.copy(statParam)
    skusParam.target = 'skus'
    skusParam.type = 'add'
    delete skusParam.limit
    Statistics.query(skusParam, function(result) {
      var skusTotal = 0;
      result.forEach(function (item) {
        skusTotal += item.value.sumPrice;
      })
      $scope.skusNum = numberWithCommas((skusTotal / 100).toFixed(0));
    })
  }

  function statMerchantProfit() {
    var profitParam = angular.copy(statParam)
    profitParam.target = 'deals'
    profitParam.itemID = 'count'
    Statistics.query(profitParam, function(result) {
      if (result.length) {
        $scope.profit = numberWithCommas((result[0].value.profit/100).toFixed(2))
      } else {
        $scope.profit = 0
      }
    })
  }

  function stat() {
    if($scope.currentMerchant.merchant.id) {
      statParam.keyID = $scope.currentMerchant.merchant.id
      statMerchantSale()
      statMerchantSku()
      statMerchantProfit()
      shopSaleFetch()
      itemSaleFetch()
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //event
  $scope.$on('currentMerchantReady', function (event, data) {
    stat()
  })
  
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
    stat()
    widthFunctions();
  };
}
