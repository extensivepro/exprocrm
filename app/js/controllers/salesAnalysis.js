function SalesAnalysisController($scope, Statistics, Shops, Items) {
  /**
   * chart init
   * @type {{}}
   */
  function chartInit() {
    var chart = {};
    chart.type = "AreaChart";
    chart.displayed = true;
    chart.cssStyle = "height:300px; width:100%;text-align: right;";
    chart.data = {"cols": [
      {id: "period", label: "周期", type: "string"},
      {id: "sales", label: "销售", type: "number"}
    ], "rows": []};
    chart.options = {
      "title": "商户销售额走势",
      "isStacked": "false",
      "legend": "none",
      "fill": 50,
      "displayExactValues": true,
      "vAxis": {
        "title": "人民币(元)",
        "gridlines": {"count": 10},
        "titleTextStyle": {italic: false, bold: true},
        "baseline": 0
      },
      "hAxis": {
        "title": "时间",
        "maxAlternation": 1,
        "slantedText": false,
        "titleTextStyle": {italic: false, bold: true}
      }
    };
    return chart
  }

  $scope.chart = chartInit()

  /**
   * configure chart for merchant
   * @type {{}}
   */
  function merchantChartConfig(chart) {
    chart.options.legend = "none"
    chart.options.title = "商户销售额走势"
    chart.data = {"cols": [
      {id: "period", label: "周期", type: "string"},
      {id: "sales", label: "销售", type: "number"}
    ], "rows": []};
    $scope.refreshChart()
  }

  /**
   * configure chart for shop
   * @type {string}
   */
  function shopChartConfig(chart) {
    chart.options.legend = {position: 'bottom'}
    chart.options.title = "商店销售额走势"
    var shopChartCol = []
    Shops.query({merchantID: statistics.keyID, $sort: {name: 1, id: 1}, $fields: {id: 1, merchantID: 1, name: 1}}, function (result) {
      shopChartCol = [
        {id: "period", label: "周期", type: "string"}
      ]
      result.forEach(function (item) {  //each item is a shop
        var shop = {}
        shop.id = "sales"
        shop.label = item.name
        shop.type = "number"
        shopChartCol.push(shop)
      })
      chart.data.cols = shopChartCol
      $scope.refreshChart()
    })
  }

  /**
   * configure pie chart for shops
   * @type {string}
   */
  function shopPieChartConfig() {
    var pieChart = chartInit()
    pieChart.options.legend = {position: 'left'}
    pieChart.options.title = "商店销售额比例"
    pieChart.data.cols = [
      {id: "shopName", label: "商店名称", type: "string"},
      {id: "shopSale", label: "销售额", type: "number"}
    ]
    pieChart.type = "PieChart"
    Shops.query({merchantID: statistics.keyID, $sort: {name: 1, id: 1}, $fields: {id: 1, merchantID: 1, name: 1}}, function (result) {
      result.forEach(function (item) {  //each item is a shop
        var shop = {}
        shop.name = item.name
        shop.sale = 0
        shop.percentage = 0
        //query for total sale of a shop
        var shopTotal = 0
        var statisticsShop = Object.create(statistics)
        statisticsShop.keyID = item.id
        statisticsShop.query(function (result) {
          if (!result.length == 0) {
            result.forEach(function (item) {  //each item is a statistic
              shopTotal += item.value.sale.total / 100
            })
            shop.sale = shopTotal.toFixed(2)
            shop.percentage = (100 * shop.sale / $scope.totalSale).toFixed(2)
            var shopC = {c: [
              {v: shop.name},
              {v: Number(shop.sale)}
            ]};
            pieChart.data.rows.push(shopC)
          }
        })
      })
    })
    return pieChart
  }

  /**
   * default value config
   * @type {string}
   */

  $scope.analysisModel = 'merchant';
  $scope.periodModel = 'lastWeek';
  $scope.unitModel = 'daily';
  $scope.today = new Date()
  $scope.dt = $scope.today
  $scope.allShops = false

  /**
   * table headers and sort function
   * @type {Array}
   */
  $scope.headers = ['name', 'sale', 'percentage', 'crr', 'yyb']
  $scope.headersZ = ['商店名称', '销售额(元)', '百分比', '环比', '同比']
  $scope.columnSort = { sortColumn: 'percentage', reverse: true };

  /**
   * statistics init
   * @type {Statistics}
   */
  var statistics = undefined
  $scope.statistics = statistics

  /**
   * time setting
   * @type {boolean}
   */
  function timeSet() {
    //set limit according to selected
    if ($scope.periodModel == 'lastWeek') {
      statistics.limit = 7;
      $scope.dt = new Date();
    }
    if ($scope.periodModel == 'lastMonth') {
      statistics.limit = 30;
      $scope.dt = new Date();
    }
    if ($scope.periodModel == 'custom') {
      statistics.limit = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') + 1
      $scope.dt = $scope.dateRange.endDate.toDate()
      $scope.stdt = $scope.dateRange.startDate.toDate()
    }

    if (!($scope.periodModel == 'custom')) {
      $scope.dateRange = {
        endDate: moment($scope.dt),
        startDate: moment().subtract('days', statistics.limit - 1)
      }
      $scope.stdt = $scope.dateRange.startDate.toDate()
    }

    statistics.period = $scope.unitModel;
    if (statistics.period == "weekly")
      statistics.limit = Math.floor(statistics.limit / 7);
    if (statistics.period == "monthly")
      statistics.limit = Math.floor(statistics.limit / 30);
  }

  /**
   * set row data, time
   */
  function rowSet(rows, until) {
    //set hAxis, time
    for (var i = statistics.limit, j = 0; i > 0; i--) {
      var d = statistics.periodDate(until - i + 1)
      var day = moment(d).weekday()
      switch (day) {
        case 0:
          day = '日';
          break;
        case 1:
          day = '一';
          break;
        case 2:
          day = '二';
          break;
        case 3:
          day = '三';
          break;
        case 4:
          day = '四';
          break;
        case 5:
          day = '五';
          break;
        case 6:
          day = '六';
          break;
      }
      var flag = false
      var c = {c: []}
      for (var k = 0; k < $scope.chart.data.cols.length; k++)
        c.c.push({v: 0})
      c.c[0] = {v: (d.getMonth() + 1) + '月' + d.getDate() + '日(' + day + ')'}
      flag = true
      if (flag == true) {
        rows.push(c)
      }
//      console.log(rows)
    }
  }

  /**
   * switch to single shop mode
   * @param shop
   */
  $scope.toSingleShop = function (shop) {
    $scope.shop = shop
  }

  /**
   * go to certain shop from table link
   */
  $scope.toShop = function (id, name, shop) {
    $scope.analysisModel = "shop"
    singleShopChartConfig(name, $scope.chart)
//    $scope.shop = shop
    timeSet()
    $scope.weekDisable = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') <= 7 ? true : false
    $scope.monthDisable = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') <= 30 ? true : false
    var rows = []
    var until = statistics.until($scope.dt)
    rowSet(rows, until)
    singleShopSaleSet(rows, until, id)
    itemTableData()
    refreshing = false
//    console.log($scope.shop)
  }

  /**
   * config chart for single shop
   */
  function singleShopChartConfig(name, chart) {
    chart.options.legend = 'none'
    chart.options.title = name + "销售额走势"
    chart.data.cols = [
      {id: "period", label: "周期", type: "string"},
      {id: "sales", label: "销售", type: "number"}
    ]
  }

  /**
   * set sale for single shop
   */
  function singleShopSaleSet(rows, until, id) {
    var statisticsShop = Object.create(statistics)
    statisticsShop.keyID = id
    statisticsShop.query(function (result) {
      result.forEach(function (item) {
        var v = item.value
        $scope.totalSale += v.sale.total / 100;
        var c = rows[v.statAt - until + statistics.limit - 1]
        c.c[1] = {v: v.sale.total / 100, f: v.sale.total / 100 + "元\n共: " + v.sale.count + "次"}
      })
      $scope.chart.data.rows = rows
    })
  }

  /**
   * fetch data for item table
   */
  function itemTableData() {
    var items = []
    Items.query({merchantID: statistics.keyID, $fields: {id: 1, merchantID: 1, name: 1}}, function(result) {
      $scope.itemRow = []
      result.forEach(function(unit) {
        var item = {}
        item.name = unit.name
        item.sale = 0
        item.quantity = 0
        item.id = unit.id
        item.percentage = 0

        var itemSaleTotal = 0
        var itemQuantityTotal = 0
        var statisticsItem = Object.create(statistics)
        statisticsItem.keyID = unit.id
        statisticsItem.query(function(result){
          if (!result.length == 0) {
            result.forEach(function(unit){
              itemSaleTotal += unit.value.sale.total / 100
              itemQuantityTotal += unit.value.sale.count
            })
            item.sale = itemSaleTotal.toFixed(2)
            item.percentage = (100 * item.sale / $scope.totalSale).toFixed(2)

            var itemC = {c:[
              {v: item.name},
              {v: Number(item.sale)}
            ]}
            $scope.itemRow.push(itemC)
          }
        })
        items.push(item)
      })
      $scope.items = items
//      console.log($scope.items)

    })
  }

  /**
   * fetch data for shop table
   */
  function shopTableData() {
    //query for shops of the merchant
    var shops = [];
    Shops.query({merchantID: statistics.keyID, $sort: {name: 1, id: 1}, $fields: {id: 1, merchantID: 1, name: 1}}, function (result) {
      $scope.shopRow = []
      result.forEach(function (item, index) {  //each item is a shop
        var shop = {}
        shop.name = item.name
        shop.sale = 0
        shop.id = item.id
        shop.percentage = 0
        //query for total sale of a shop
        var shopTotal = 0
        var statisticsShop = Object.create(statistics)
        statisticsShop.keyID = item.id
        statisticsShop.query(function (result) {
          if (!result.length == 0) {
            result.forEach(function (item) {  //each item is a statistic
              shopTotal += item.value.sale.total / 100
            })
            shop.sale = shopTotal.toFixed(2)
            shop.percentage = (100 * shop.sale / $scope.totalSale).toFixed(2)

            var shopC = {c: [
              {v: shop.name},
              {v: Number(shop.sale)}
            ]};
            $scope.shopRow.push(shopC)
          }
        })
        shops.push(shop)
      })
      $scope.shops = shops
    })
  }

  /**
   * fetch data for employee table
   */
  function employeeTableData(shopID) {

  }

  /**
   * set sales for merchant analysis
   * @param rows
   * @param until
   */
  function merchantSaleSet(rows, until) {
    statistics.query(function (result) {
      //add row data, the sales
      result.forEach(function (item) {
        var v = item.value
        $scope.totalSale += v.sale.total / 100;
        var c = rows[v.statAt - until + statistics.limit - 1]
        c.c[1] = {v: v.sale.total / 100, f: v.sale.total / 100 + "元\n共: " + v.sale.count + "次"}
      })
      $scope.chart.data.rows = rows
      shopTableData()
      refreshing = false
    })
  }

  /**
   * set sales for shop analysis
   * @type {boolean}
   */
  function shopSaleSet(rows, until) {
    Shops.query({merchantID: statistics.keyID, $sort: {name: 1, id: 1}, $fields: {id: 1, merchantID: 1, name: 1}}, function (result) {
      result.forEach(function (item, index) {  //each item is a shop
        var statisticsShop = Object.create(statistics)
        statisticsShop.keyID = item.id
        statisticsShop.query(function (result) {
          result.forEach(function (item) {
            var v = item.value
            $scope.totalSale += v.sale.total / 100;
            var c = rows[v.statAt - until + statistics.limit - 1]
            c.c[index + 1] = {v: v.sale.total / 100, f: v.sale.total / 100 + "元\n共: " + v.sale.count + "次"}
          })
        })
      })
      $scope.chart.data.rows = rows
      itemTableData()
      refreshing = true
    })
  }

  /**
   * info display
   * @type {boolean}
   */
  var refreshing = false      //loop jumper
  $scope.refreshChart = function () {
//    console.log('refreshing')
    if (refreshing) return;
    refreshing = true
//    console.log('refreshed')
    $scope.totalSale = 0;

    timeSet()

    $scope.weekDisable = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') <= 7 ? true : false
    $scope.monthDisable = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') <= 30 ? true : false

    var rows = []
    var until = statistics.until($scope.dt)

    rowSet(rows, until)

    if ((($scope.analysisModel == 'merchant') && ($scope.allShops == false))){
//      merchantChartConfig($scope.chart)
      merchantSaleSet(rows, until)
    }
    if ($scope.analysisModel == 'merchant' && $scope.allShops == true) {
      shopChartConfig($scope.chart)
      shopSaleSet(rows, until)
    }
    if (($scope.analysisModel == 'shop') && ($scope.shop == undefined)) {
      shopChartConfig($scope.chart)
      shopSaleSet(rows, until)
//      $scope.pieChart = shopPieChartConfig()
    } else {

    }
  }

  $scope.$watch('onShop', function(){
    if($scope.onShop == true) {
      $scope.headers = ['name', 'sale', 'quantity', 'percentage', 'crr', 'yyb']
      $scope.headersZ = ['商店名称', '销售额(元)', '数量(个)', '百分比', '环比', '同比']
    }
  })
  $scope.$watch('allShops', function(){
    if ($scope.analysisModel == 'merchant' && $scope.allShops == true){
      shopChartConfig($scope.chart)
    }
    if ($scope.analysisModel == 'merchant' && $scope.allShops == false){
      refreshing = false
      $scope.chart = chartInit()
      merchantChartConfig($scope.chart)
    }
  })
  $scope.$watch('shop', function () {
    if (!($scope.shop == undefined))
      $scope.toShop($scope.shop.id, $scope.shop.name, $scope.shop)
  })
  $scope.$watch('statistics.period', function () {
    $scope.refreshChart()
  })
  $scope.$watch('dateRange', function () {
    $scope.unitModel = 'daily';
    $scope.refreshChart()
  })
  $scope.$watch('unitModel', function () {
    $scope.refreshChart()
  })
  $scope.$watch('periodModel', function () {
    $scope.refreshChart()
  })
  $scope.$watch('dt', function () {
    $scope.refreshChart()
  })
  $scope.$watch('analysisModel', function () {
    if (($scope.analysisModel == 'shop')) {
      shopChartConfig($scope.chart)
      $scope.pieChart = shopPieChartConfig()
      $scope.onShop = true
      $scope.allShops = true
      $scope.areaChartFull = "span8"
    }
    if (($scope.analysisModel == 'merchant')) {
      $scope.allShops = false
//      console.log('on merchant')
      refreshing = false
      $scope.chart = chartInit()
      merchantChartConfig($scope.chart)

      $scope.onShop = false
      $scope.areaChartFull = "span12"
    }
  })

  $scope.chartReady = function () {
    fixGoogleChartsBarsBootstrap();
  }

  function fixGoogleChartsBarsBootstrap() {
    $(".google-visualization-table-table img[width]").each(function (index, img) {
      $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
    });
  };

  $scope.init = function () {
    /**
     * inputted ID, currently fixed
     * @type {Statistics}
     */
    statistics = new Statistics('e20dccdf039b3874')
    widthFunctions()
  }
}