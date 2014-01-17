function MerchantAnalysisController($scope, Statistics) {
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
      "title": "经营趋势",
      "isStacked": "false",
      "fill": 20,
      "displayExactValues": true,
      "vAxis": {
          "title": "人民币/元", "gridlines": {"count": 10}
      },
      "hAxis": {
          "title": "单位：日"
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
  $scope.statis = {
    keyID: '2834910281d26a76',
    period: 86400000,
    rowCount: 7,
    from: Date.now()-86400000*7
  }
  
  $scope.refreshChart = function () {
    Statistics.query($scope.statis, function (result) {
      var updateRows = result.map(function (item) { return item.value })
      from = $scope.statis.from
      var rows = []
      for (var i = 0, j = 0; i < $scope.statis.rowCount; i++) {
        var d = new Date(from+$scope.statis.period*i)
        var c = {c:[ {v: (d.getMonth()+1)+'/'+d.getDate() },{v: 0},{v: 0},{v: 0} ]};
        var t = d.setHours(0,0,0,0)

        for(;j < updateRows.length; j++) {
          var v = updateRows[j]
          var ut = new Date(v.statAt*1000).setHours(0,0,0,0)
          if(t > ut ) continue;
          else if( t < ut) break;
          c.c[1] = {v: v.sale.total/100, f: v.sale.total/100+"元\n成交: "+v.sale.count+"次"}
          c.c[2] = {v: v.return.total/100, f: v.return.total/100+"元\n退货: "+v.return.count+"次"}
          c.c[3] = {v: v.prepay.total/100, f: v.prepay.total/100+"元\n充值: "+v.prepay.count+"次"}
        }
        rows.push(c);
      }
      chart1.data.rows = rows;
    })
  }
  
  $scope.chartSelectionChange = function () {

      if (($scope.chart.type === 'Table' && $scope.chart.data.cols.length === 6 && $scope.chart.options.tooltip.isHtml === true) ||
          ($scope.chart.type != 'Table' && $scope.chart.data.cols.length === 6 && $scope.chart.options.tooltip.isHtml === false)) {
          $scope.chart.data.cols.pop();
          delete $scope.chart.data.rows[0].c[5];
          delete $scope.chart.data.rows[1].c[5];
          delete $scope.chart.data.rows[2].c[5];
      }


      if ($scope.chart.type === 'Table') {

          $scope.chart.options.tooltip.isHtml = false;

          $scope.chart.data.cols.push({id: "data-id", label: "Date", type: "date"});
          $scope.chart.data.rows[0].c[5] = {v: "Date(2013,01,05)"};
          $scope.chart.data.rows[1].c[5] = {v: "Date(2013,02,05)"};
          $scope.chart.data.rows[2].c[5] = {v: "Date(2013,03,05)"};
      }

  }


  $scope.htmlTooltip = function () {

      if ($scope.chart.options.tooltip.isHtml) {
          $scope.chart.data.cols.push({id: "", "role": "tooltip", "type": "string", "p": { "role": "tooltip", 'html': true} });
          $scope.chart.data.rows[0].c[5] = {v: " <b>Shipping " + $scope.chart.data.rows[0].c[4].v + "</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />"};
          $scope.chart.data.rows[1].c[5] = {v: " <b>Shipping " + $scope.chart.data.rows[1].c[4].v + "</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />"};
          $scope.chart.data.rows[2].c[5] = {v: " <b>Shipping " + $scope.chart.data.rows[2].c[4].v + "</b><br /><img src=\"http://icons.iconarchive.com/icons/antrepo/container-4-cargo-vans/512/Google-Shipping-Box-icon.png\" style=\"height:85px\" />"};
      } else {
          $scope.chart.data.cols.pop();
          delete $scope.chart.data.rows[0].c[5];
          delete $scope.chart.data.rows[1].c[5];
          delete $scope.chart.data.rows[2].c[5];
      }
  }


  $scope.hideServer = false;
  $scope.selectionChange = function () {
      if ($scope.hideServer) {
          $scope.chart.view = {columns: [0, 1, 2, 4]};
      } else {
          $scope.chart.view = {};
      }
  }

  $scope.formatCollection = formatCollection;
  $scope.toggleFormat = function (format) {
      $scope.chart.formatters[format.name] = format.format;
  };

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
  
  $scope.init = function () {
    $scope.refreshChart()
  }
}