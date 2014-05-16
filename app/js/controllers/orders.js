/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-4-19
 */
function OrdersController($scope, Orders, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Orders;
  $scope.searchOptions.fields = ['status']
  $scope.searchOptions.tooltip = "请输入订单状态"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "sequenceNumber", title: "订单号"},
    {name: "type", title: "类型", value: function (entity) {
      if (entity.type == 'booking') {
        return '预订';
      } else if (entity.type == 'deliver') {
        return '外送';
      } else {
        return '';
      }
    }},
    {name: "memo", title: "备注", listHide: true, isProfileHide: true, isArray:true},
    {name: "items", title: "商品", listHide: true, isArray:true},
    {name: "agent", title: "经手人", listHide: true, isObject: true},
    {name: "shop", title: "商店", listHide: true, isObject:true},
    {name: "customer", title: "顾客", isObject: true, isProfileHide: true, value: function(entity) {
      return entity.customer.name;
    }},
    {name: "fee", title: "费用/元", value: function (entity) {
      return (entity.fee / 100).toFixed(2);
    }},
    {name: "quantity", title: "数量"},
    {name: "status", title: "订单状态", value: function (entity) {
      entity.fieldClass = entity.fieldClass || {}
      if (entity.status === 'placed') {
          entity.fieldClass.status = "label label-info"
          return '已下单'
      } else if (entity.status === 'accepted') {
          entity.fieldClass.status = "label label-primary"
          return  '已接受'
      } else if (entity.status === 'rejected') {
          entity.fieldClass.status = "label label-default"
          return '已拒绝'
      } else if (entity.status === 'executed') {
        entity.fieldClass.status = "label label-success"
        return '已履行'
      } else if (entity.status == 'canceled' || entity.status == 'cancel') {
        entity.fieldClass.status = "label label-danger"
        return '已取消'
      } else if (entity.status === 'paid') {
        entity.fieldClass.status = "label label-success"
        return '已结账'
      } else {
        return ''
      }
    }},
    {name: "payment", title: "付款状态", value: function (entity) {
      if (!entity.payment) {
        entity.payment = {

        }
      }
      entity.fieldClass = entity.fieldClass || {}
      if (entity.payment.status === 'paid') {
        entity.fieldClass.payment = "label label-info"
          return '已付款'
      } else if (entity.payment.status === 'unpaid'){
        entity.fieldClass.payment = "label label-danger"
        return '未付款'
      } else {
        return '';
      }
    }},
    {name: "receipt", title: "收获信息", listHide: true, isObject: true},
    {name: "createdAt", title: "创建时间"}
  ];
  
  // profile
  $scope.profileShortcuts = [
    {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-print", text: "打印", op:"print"}
  ];
  
  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/orders/profile.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.isBtnGroup = true; //
  $scope.btns = [
    {
      key:'',
      value: '全部'
    },
    {
      key:'placed',
      value:'已下单'
    },
    {
      key:'accepted',
      value:'已接受'
    },
    {
      key:'rejected',
      value:'已拒绝'
    },
    {
      key:'executed',
      value:'已履行'
    },
    {
      key:'canceled',
      value:'已取消'
    },
    {
      key:'paid',
      value:'已结账'
    }
  ];
  $scope.currentBtn = {};
  $scope.currentBtn.btn = $scope.btns[0];

  $scope.btnsForOrder = [
    {
      key:'',
      value: '全部'
    },
    {
      key:'paid',
      value:'已付款'
    },
    {
      key:'unpaid',
      value:'未付款'
    }
  ];
  $scope.currentBtnForOrder = {};
  $scope.currentBtnForOrder.btn = $scope.btnsForOrder[0];
  $scope.search = {};
  $scope.$watch('currentBtn.btn', function () {
    var key = $scope.currentBtn.btn.key;
    $scope.search.text = key;
    $timeout(function () {
      $scope.refreshList();
    }, 10)
  });
  $scope.$watch('currentBtnForOrder.btn', function () {
    var key = $scope.currentBtnForOrder.btn.key;
    if (key == 'unpaid') {
      $scope.params['payment.status'] = "unpaid"
      $scope.countQs['payment.status'] = "unpaid";
    } else if(key == 'paid'){
      $scope.params['payment.status'] = "paid"
      $scope.countQs['payment.status'] = "paid";
    } else {
      delete $scope.params['payment.status'];
      delete $scope.countQs['payment.status'];
    }
    $timeout(function () {
      $scope.refreshList();
    }, 20);
  });
  $scope.checkPaidStatus = function (entity) {
    $scope.unchecked = false;
    if (entity.payment&& (entity.payment.status == 'unpaid')) {
      $scope.unchecked = true;
    }
  };
  $scope.paid = function () {
    var obj = {
      id : $scope.entity.id,
      payment: {
        type: "cash",
        status: "paid"
      }
    };
    if (confirm("确认已付款吗?")) {
      Orders.update(obj, function (result) {
        $scope.showList()
      }, function (err) {
        console.log('err:\n', err);
      })
    }
  };
  $scope.cancel = function () {
    var obj = {
      id : $scope.entity.id,
      status: 'canceled'
    };
    if (confirm("确认取消订单吗?")) {
      Orders.update(obj, function (result) {
        $scope.showList()
      }, function (err) {
        console.log('err:\n', err);
      })
    }
  }
  var now = function (order) {    
    var d = new Date(order.updateAt*1000);    
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes();
  }
  var destination = function (order) {    
    var str = "";    
    if(order.type === 'booking' && order.openRes) {        
      str += "桌号："+order.openRes.code+"<br>"        
      str += "\n"    
    } else if( order.type === 'deliver' && order.receipt) {        
      if(!order.receipt.name) order.receipt.name = "未提供";        
      if(!order.receipt.phone) order.receipt.phone = "未提供";        
      if(!order.receipt.address) order.receipt.address = "未提供";        
      str += "客户："+order.receipt.name+"<br>电话："+order.receipt.phone+"<br>地址："+order.receipt.address+"<br><br>"    
    }    
    return str;
  }
  
  var formatExecuted = function (order) {    
    var str ="<big>出品单</big><br><p>序号："+order.sequenceNumber+"<br>"+order.shop.merchant.name+"-"+order.shop.name+"<br>"
    str += "时间："+now(order)+"<br><br>"
    str += destination(order)
    str += "<table rules=\"groups\"><thead><tr><th>品名</th><th>数量</th><th>金额</th></tr></thead><tbody>"
    order.items.forEach(function (item) {
      str += "<tr><td>"+item.item.name+"</td><td>"+item.quantity+"</td><td>"+item.dealPrice*item.quantity/100+"</td></tr>"
    });
    str += "</tbody><tfoot><tr><td>总计:</td><td>"+order.quantity+"件</td><td>"+order.fee/100+"</td></tr></tfoot></table>"
    str += "<strong>"
    if(order.payment.status === 'paid') {
      str += "已付清"
    }else {
      str += "未付款"
    }
    str += "</strong><br><br>备注：<br>"
    order.memo.forEach(function (m) {    
      if(m.message) str += m.message+"<br>"
    })
    str +="<br><br><br></p>"
    return str
  }
  
  $scope.print = function (entity) {
    var mywindow = window.open('', 'print preview', 'height=600,width=600');
    mywindow.document.write('<html><head><title>打印预览</title>');
    mywindow.document.write('<STYLE TYPE="text/css">p{font-size: 6pt} TD{font-size: 6pt;} th{font-size: 6pt}</STYLE></head><body >');
    mywindow.document.write(formatExecuted(entity));
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();
  }
  
  $scope.isHide = true; //隐藏新增按钮
  $scope.params['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
  $scope.countQs['shop.id'] = JSON.stringify({"$in":$scope.currentMerchant.merchant.shopIDs});
}