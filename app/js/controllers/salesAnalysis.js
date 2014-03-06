function SalesAnalysisController($scope, Statistics, Shops, Employes, Items) {
  //controller initialization
  $scope.init = function () {
    $scope.analysisModel = 'merchant';
    $scope.periodModel = 'lastWeek';
    $scope.unitModel = 'daily';
    $scope.untilDate = new Date();  //change here for natural week or month
    $scope.dualChart = false;
    $scope.statisticsDeep = 2;
    $scope.tableHeader = ['name', 'sale', 'percentage', 'crr', 'yyb'];
    $scope.tableHeaderDisplay = ['商店名称', '销售额(元)', '百分比', '环比', '同比'];
    $scope.tableColumnSort = { sortColumn: 'percentage', reverse: true };
    $scope.shopsDiv = false;
    $scope.primaryChart = basicChartInit();
    $scope.offChart = basicChartInit();
    $scope.shopHashMap = {
      Set : function(key,value){this[key] = value},
      Get : function(key){return this[key]},
      Contains : function(key){return this.Get(key) == null?false:true},
      Remove : function(key){delete this[key]}
    };
    $scope.headers = ['name', 'sale', 'percentage', 'crr', 'yyb']
    $scope.headersZ = ['商店名称', '销售额(元)', '百分比', '环比', '同比']
    $scope.columnSort = { sortColumn: 'percentage', reverse: true };
    $scope.primaryKeyID = undefined;
    $scope.primaryName = undefined;
    $scope.virginEmployee = 0;
    $scope.virginItem = 0;
    widthFunctions();
  }

  //empty basic chart initialization
  function basicChartInit() {
    var chart = {};
    chart.displayed = true;
    chart.cssStyle = "height:350px; width:100%;text-align: right;";
    chart.data = {"cols": [], "rows": []};
    chart.options = {
      "isStacked": "false",
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

  //chart configuration
  function chartConfig(chart, type, title, cols, legend, callback) {
    chart.type = type;
    chart.data.cols = cols;
    chart.data.rows = [];
    chart.options.title = title;
    chart.options.legend = legend;
    if ($scope.dualChart == false){
      $scope.primaryChartFull = "col-lg-12";
      return callback()
    } else{
      $scope.primaryChartFull = "col-lg-8";
      return callback()
    }
  }

  //set cols for division chart
  function colSet(primaryCols, primaryType, primaryTitle, primaryLegend, callback) {
    primaryCols = [
      {id: "period", label: "周期", type: "string"}
    ];
    $scope.shopsResult.forEach(function (item) {  //each item is a shop
      var shop = {};
      shop.id = "sales";
      shop.label = item.name;
      shop.type = "number";
      primaryCols.push(shop);
    })
    chartConfig($scope.primaryChart, primaryType, primaryTitle, primaryCols, primaryLegend, callback);
  }

  //chart handler
  function chartHandler(callback) {
    var chart = basicChartInit();
    var primaryType = 'AreaChart';
    var primaryTitle = ($scope.primaryName == undefined) ? '商户销售趋势' : $scope.primaryName + '销售趋势';
    var primaryLegend = ($scope.shopsDiv != false) ? 'null' : 'none';
    if ($scope.shopsDiv == true) {
      var primaryCols = [];
      if ($scope.analysisModel == 'merchant'){
        Shops.query({merchantID: $scope.primaryStatParam.keyID, '$fields': {id: 1, merchantID: 1, name: 1}}, function (result){
          $scope.shopsResult = result;
          colSet(primaryCols, primaryType, primaryTitle, primaryLegend, callback);
        })
      }
      if ($scope.analysisModel == 'shop'){
        Employes.query({'shopID': $scope.primaryStatParam.keyID, $fields: {id: 1, shopID: 1, name: 1}}, function (result){
          $scope.shopsResult = result; //should not have used this name
          colSet(primaryCols, primaryType, primaryTitle, primaryLegend, callback);
        })
      }
      if ($scope.analysisModel == 'shopItem'){
        Items.query({'shopID': $scope.primaryStatParam.keyID, $fields: {id: 1, shopID: 1, name: 1}}, function (result){
          $scope.shopsResult = result; //should not have used this name
          colSet(primaryCols, primaryType, primaryTitle, primaryLegend, callback);
        })
      }
    }
    if ($scope.shopsDiv == false) {
      var primaryCols = [
        {id: "period", label: "周期", type: "string"},
        {id: "sales", label: "销售", type: "number"}
      ];
      chartConfig($scope.primaryChart, primaryType, primaryTitle, primaryCols, primaryLegend, callback);
    }
    if ($scope.dualChart == true) {
      var offType = 'PieChart';
      var offTitle = '商店销售比例';
      if ($scope.analysisModel == 'merchant')
        offTitle = '商店销售比例';
      if ($scope.analysisModel == 'shop')
        offTitle = '员工销售比例';
      if ($scope.analysisModel == 'item')
        offTitle = '商品销售比例';
      var offLegend = {position: 'left'};
      var offCols = [
        {id: "period", label: "周期", type: "string"},
        {id: "sales", label: "销售", type: "number"}
      ];
      chartConfig($scope.offChart, offType, offTitle, offCols, offLegend, function(){});
    }
  }

  //set row text
  function rowSet(statParam, chart, rows, until, callback) {
    for (var i = statParam.limit, j = 0; i > 0; i--) {
      var d = Statistics.periodDate(until - i + 1, statParam.period);
      var day = moment(d).weekday();
      switch (day) {
        case 0: day = '日'; break;
        case 1: day = '一'; break;
        case 2: day = '二'; break;
        case 3: day = '三'; break;
        case 4: day = '四'; break;
        case 5: day = '五'; break;
        case 6: day = '六'; break;
      }
      var flag = false;
      var c = {c: []};
      for (var k = 0; k < chart.data.cols.length; k++)
        c.c.push({v: 0});
      c.c[0] = {v: (d.getMonth() + 1) + '月' + d.getDate() + '日(' + day + ')'};
      flag = true;
      if (flag == true) {
        rows.push(c);
      }
    }
    return callback();
  }

  //initialize statistics parameters
  function statParamInit(keyIDs) {
    var statParam = {}
    statParam.keyID = keyIDs;
    statParam.period = $scope.unitModel;
    if ($scope.periodModel == 'lastWeek') {
      statParam.limit = 7;
      $scope.untilDate = new Date();
      $scope.stdt = moment($scope.untilDate).subtract('days', statParam.limit - 1).toDate()
    }
    if ($scope.periodModel == 'lastMonth') {
      statParam.limit = 30;
      $scope.untilDate = new Date();
      $scope.stdt = moment($scope.untilDate).subtract('days', statParam.limit - 1).toDate()
    }
    if ($scope.periodModel == 'custom') {
      statParam.limit = $scope.dateRange.endDate.diff($scope.dateRange.startDate, 'days') + 1;
      $scope.untilDate = $scope.dateRange.endDate.toDate();
      $scope.stdt = $scope.dateRange.startDate.toDate();
    }
    if (statParam.period == "weekly")
      statParam.limit = Math.floor(statParam.limit / 7);
    if (statParam.period == "monthly")
      statParam.limit = Math.floor(statParam.limit / 30);
    return statParam;
  }

  //set sale numbers
  function saleSet(rows, until, statParam, chart, callback) {
    if ($scope.statisticsDeep == 1) {
      Statistics.query(statParam, function (result) {
        result.forEach(function (item) {
          var v = item.value;
          var c = rows[v.statAt - until + statParam.limit - 1];
          c.c[1] = {v: v.sale.total / 100, f: v.sale.total / 100 + "元\n共: " + v.sale.count + "次"};
        })
        chart.data.rows = rows;
        return callback();
      })
    }
    if ($scope.statisticsDeep == 2) {
      $scope.shopKeyIDs = [];
      $scope.shopsResult.forEach(function (item, index) {
        $scope.shopKeyIDs.push(item.id);
        $scope.shopHashMap.Set(item.id, index);
//        console.log(item.id)
        $scope.shopHashMap.Set(index, item.name);
      })
      if ($scope.analysisModel == 'shopItem'){
        statParam.keyID = $scope.currentShop.id;
        statParam.itemID = $scope.shopKeyIDs;
        statParam.target = 'deals';
      }
      else
        statParam.keyID = $scope.shopKeyIDs;
//      console.log(statParam)
      Statistics.query(statParam, function (result){
        $scope.statResult = result;
        result.forEach(function(item) {
          var v = item.value;
          var c = rows[v.statAt - until + statParam.limit - 1];
          var index = $scope.shopHashMap.Get(item.id.split('#')[0]);
//          console.log(item.id)
          if ($scope.analysisModel == 'shopItem'){
            index = $scope.shopHashMap.Get(item.id.split('#')[2]);
            c.c[index + 1] = {v: v.sumPrice / 100, f: v.sumPrice / 100 + "元\n共: " + v.count + "次"};
          }
          else
            c.c[index + 1] = {v: v.sale.total / 100, f: v.sale.total / 100 + "元\n共: " + v.sale.count + "次"};
        })
        chart.data.rows = rows;
        return callback();
      })
    }
  }

  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  }

  function sumSet(statParam, chart, callback) {
    $scope.tbRows = [];
    var hist = {};
    var names = [];
    var ids = [];
    var total = 0;
    $scope.statResult.map(function (a){
      var index =  $scope.shopHashMap.Get(a.id.split('#')[0]);
      if ($scope.analysisModel == 'shopItem')
        index =  $scope.shopHashMap.Get(a.id.split('#')[2]);
      var name = $scope.shopHashMap.Get(index);
      if ($scope.analysisModel == 'shopItem')
        total += a.value.sumPrice/100;
      else
        total += a.value.sale.total/100;
      if (!names.contains(name)){
        names.push(name);
        if ($scope.analysisModel == 'shopItem')
          ids.push(a.id.split('#')[2]);
        else
          ids.push(a.id.split('#')[0]);
      }
      if(name in hist){
        if ($scope.analysisModel == 'shopItem')
          hist[name] += a.value.sumPrice/100;
        else
          hist[name] += a.value.sale.total/100;
      }
      else{
        if ($scope.analysisModel == 'shopItem')
          hist[name] = a.value.sumPrice/100;
        else
          hist[name] = a.value.sale.total/100;
      }
    })
    for (var counter = 0; counter < names.length; counter ++) {
      var tbRow = {};
      tbRow.name = names[counter];
      tbRow.id = ids[counter];
      tbRow.sale = hist[names[counter]].toFixed(1);
      tbRow.percentage = (100 * tbRow.sale / total).toFixed(1);
      $scope.tbRows.push(tbRow);
      var content = {c:[
        {v: names[counter]},
        {v: Number(hist[names[counter]].toFixed(1))}
      ]};
      chart.data.rows.push(content);
    }
    return callback();
  }
  var refresh = false
  function refreshChart() {
    if (refresh == true) return;
    refresh = true;
    var primaryID = $scope.primaryKeyID ||'e20dccdf039b3874';
    console.log('refreshing')
    if (true) {
      $scope.primaryStatParam = statParamInit(primaryID)
      fillChart($scope.primaryStatParam)
    }
  }
  function fillChart(statParam) {
    if ($scope.periodModel != 'custom'){
      $scope.unitModel = 'daily';
      $scope.dateRange = {
        endDate: moment($scope.untilDate),
        startDate: moment().subtract('days', $scope.primaryStatParam.limit - 1)
      };
    }
    chartHandler(function (){
      var rows = []
      var until = Statistics.until($scope.untilDate, statParam.period);
      statParam.end = until;
      statParam.start = until - statParam.limit;
      rowSet(statParam, $scope.primaryChart, rows, until, function (){
//        if ($scope.analysisModel == 'shopItem')
//          console.log(statParam);
        saleSet(rows, until, statParam, $scope.primaryChart, function() {
          console.log('Sale Set to primary chart completed'); //if load is to be added, this is the place
          if ($scope.dualChart == true)
            sumSet(statParam, $scope.offChart, function (){})
          refresh = false;
        });
        $scope.weekDisable = moment($scope.untilDate).diff(moment($scope.stdt), 'days') <= 7 ? true : false
        $scope.monthDisable = moment($scope.untilDate).diff(moment($scope.stdt), 'days') <= 30 ? true : false
      });
    });
  }
  $scope.lvlMove = function (tbRow){
    $scope.primaryKeyID = tbRow.id || tbRow;
    $scope.primaryName = tbRow.name || undefined;
    if($scope.analysisModel == 'merchant'){
      $scope.analysisModel = 'shop';
      $scope.headersZ = ['商店名称', '销售额(元)', '百分比', '环比', '同比'];
      $scope.currentShops = $scope.tbRows;
      $scope.currentShop = tbRow;
      refreshChart();
    }
    else if($scope.analysisModel == 'shop'){
      $scope.headersZ = ['员工姓名', '销售额(元)', '百分比', '环比', '同比'];
      $scope.analysisModel = 'employee';
      $scope.currentEmployees = $scope.tbRows;
      $scope.currentEmployee = tbRow;
      $scope.shopsDiv = false;
    }
    else if($scope.analysisModel == 'shopItem'){
      $scope.headersZ = ['商品名称', '销售额(元)', '百分比', '环比', '同比'];
      $scope.analysisModel = 'item';
      $scope.currentItems = $scope.tbRows;
      $scope.currentItem = tbRow;
      $scope.shopsDiv = false;
    }
    //temporary treat
    else if($scope.analysisModel == 'employee'){
      $scope.headersZ = ['商店名称', '销售额(元)', '百分比', '环比', '同比'];
      refreshChart();
    }
    else if($scope.analysisModel == 'item'){
      $scope.headersZ = ['商店名称', '销售额(元)', '百分比', '环比', '同比'];
      refreshChart();
    }
  }

  $scope.$watch('currentShop', function (){
    if ($scope.currentShop == undefined)
       return;
    $scope.primaryKeyID = $scope.currentShop.id || undefined;
    $scope.primaryName = $scope.currentShop.name;
    refreshChart();
  })

  $scope.$watch('currentEmployee', function (){
    if ($scope.currentEmployee == undefined)
      return;
    $scope.primaryKeyID = $scope.currentEmployee.id || undefined;
    $scope.primaryName = $scope.currentEmployee.name;
    console.log($scope.shopsDiv);
    if ($scope.virginEmployee == 0) {
      $scope.virginEmployee ++;
      return;
    } else
      refreshChart();
  })

  $scope.$watch('currentItem', function (){
    if ($scope.currentItem == undefined)
      return;
    $scope.primaryKeyID = $scope.currentItem.id || undefined;
    $scope.primaryName = $scope.currentItem.name;
    console.log($scope.shopsDiv);
    if ($scope.virginItem == 0) {
      $scope.virginItem ++;
      return;
    } else
      refreshChart();
  })

  $scope.$watch('analysisModel', function(){
    if ($scope.analysisModel == 'shop' || $scope.analysisModel == 'shopItem')
      refreshChart();
  })

  $scope.$watch('analysisModel', function (){
    if ($scope.analysisModel != 'employee')
      $scope.virginEmployee = 0;
    if ($scope.analysisModel != 'item')
      $scope.virginItem = 0;
  })

  $scope.$watch('shopsDiv', function() {
    console.log('attempt to refresh caused by shopsDiv')
    if ($scope.statisticsDeep == 1) {
      $scope.statisticsDeep = 2;
      $scope.dualChart = true;
      refreshChart()
    } else {
      $scope.statisticsDeep = 1;
      $scope.dualChart = false;
      refreshChart()
    }
  })
  $scope.$watch('unitModel', function () {
    console.log('attempt to refresh caused by unitModel')
    refreshChart()
  })
  $scope.$watch('periodModel', function () {
    console.log('attempt to refresh caused by perodModel')
    if ($scope.periodModel != 'custom')
      refreshChart();
  })
  $scope.$watch('dateRange', function(){
    console.log('attempt to refresh caused by dateRange')
    $scope.unitModel = 'daily';
    refreshChart();
  })
  //google chart utilities
  $scope.chartReady = function () {
    fixGoogleChartsBarsBootstrap();
  }
  function fixGoogleChartsBarsBootstrap() {
    $(".google-visualization-table-table img[width]").each(function (index, img) {
      $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
    });
  }
}