function EmployeeAnalysisController($scope, Statistics, $injector) {
  var chart1 = {};
  chart1.type = "ColumnChart";
  chart1.displayed = false;
  chart1.cssStyle = "height:600px; width:100%;";
  chart1.data = {"cols": [
    {id: "period", label: "周期", type: "string"},
    {id: "sales", label: "销售", type: "number"},
    {id: "costs", label: "退货", type: "number"},
    {id: "prepay", label: "充值", type: "number"}
  ], "rows": []};

  chart1.options = {
    "title": "营业趋势",
    "isStacked": "false",
    "fill": 20,
    "displayExactValues": true,
    "vAxis": {
      "title": "人民币/元", "gridlines": {"count": 10}
    },
    "hAxis": {
      "title": "时间"
    }
  };

  var formatCollection = [
    {
      name: "color",
      format: [
        {
          columnNum: 4,
          formats: [
            {
              from: 0,
              to: 3,
              color: "white",
              bgcolor: "red"
            },
            {
              from: 3,
              to: 5,
              color: "white",
              fromBgColor: "red",
              toBgColor: "blue"
            },
            {
              from: 6,
              to: null,
              color: "black",
              bgcolor: "#33ff33"
            }
          ]
        }
      ]
    },
    {
      name: "arrow",
      checked: false,
      format: [
        {
          columnNum: 1,
          base: 19
        }
      ]
    },
    {
      name: "date",
      format: [
        {
          columnNum: 5,
          formatType: 'long'
        }
      ]
    },
    {
      name: "number",
      format: [
        {
          columnNum: 4,
          prefix: '$'
        }
      ]
    },
    {
      name: "bar",
      format: [
        {
          columnNum: 1,
          width: 100
        }
      ]
    }
  ]

  chart1.formatters = {};

  $scope.chart = chart1;

  $scope.today = new Date()
  $scope.dt = $scope.today
  $scope.format = 'yyyy-MM-dd'
  $scope.datapickOpen = false
  $scope.open = function($event) {
    $event.preventDefault()
    $event.stopPropagation()

    $scope.datapickOpen = true;
  }
  $scope.dateOptions = {
    'year-format': "'yyyy'",
    'day-title-format': "yyyy-MM",
    'month-format': "'yyyyMM'",
    'starting-day': 1
  }
  var statistics = new Statistics("");
  $scope.statistics = statistics;


  var refreshing = false
  $scope.refreshChart = function () {
    if(refreshing) return;
    refreshing = true

    var rows = []
    var until = statistics.until($scope.dt)
    for (var i = statistics.limit, j = 0; i > 0 ; i--) {
      var d = statistics.periodDate(until-i+1)
      var c = {c:[ {v: (d.getMonth()+1)+'/'+d.getDate() },{v: 0},{v: 0},{v: 0} ]};
      rows.push(c);
    }

    statistics.query(function (result) {
      result.forEach(function (item) {
        var v = item.value
        var c = rows[v.statAt-until+statistics.limit-1]
        c.c[1] = {v: v.sale.total/100, f: v.sale.total/100+"元\n共: "+v.sale.count+"次"}
        c.c[2] = {v: v.return.total/100, f: v.return.total/100+"元\n共: "+v.return.count+"次"}
        c.c[3] = {v: v.prepay.total/100, f: v.prepay.total/100+"元\n共: "+v.prepay.count+"次"}
      })
      chart1.data.rows = rows
      refreshing = false
    })
  }

  $scope.$watch('statistics.period', function () {
    $scope.refreshChart()
  })
  $scope.$watch('dt', function () {
    $scope.refreshChart()
  })

  $scope.chartReady = function () {
    fixGoogleChartsBarsBootstrap();
  }

  function fixGoogleChartsBarsBootstrap() {
    // Google charts uses <img height="12px">, which is incompatible with Twitter
    // * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
    // *
    // * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
    // * BUT we can't change the way Google Charts renders its bars. Nor can we change
    // * the Twitter bootstrap CSS and remain future proof.
    // *
    // * Instead, this function can be called after a Google charts render to "fix" the
    // * issue by setting the style attributes dynamically.

    $(".google-visualization-table-table img[width]").each(function (index, img) {
      $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
    });
  };
  $scope.init = function (id) {
    console.log(id);
    statistics = new Statistics(id)
    $scope.statistics = statistics
    widthFunctions()
  }
}