function ShopsController($scope, Shops, Pagination, $timeout, $injector, $modal){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name', 'telephone']
  $scope.searchOptions.tooltip = "请输入商店名称或手机号码"

	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码", required: true, listHide: true, hide: true}
		,	{name: "name", title: "店名", required: true, hide: true}
    , {name: "merchantID", title: "商户ID", listHide:true, hide: true, isProfileHide: true, createHide: true}
		, {name: "address", title: "地址", required: true, hide: true}
		, {name: "printers", title: "打印机", hide: true, listHide:true, createHide:true, value:function(entity){
      if (entity.printers) {
        return entity.printers;
      } else {
        return '尚未配置打印机';
      }
    }}
    , {name:"openRes", title:"开业资源", listHide:true, hide:true, createHide:true}
		, {name: "telephone", title: "电话号码", hide: true, createHide:true}
		,	{name: "createdAt", title: "注册日期", readonly:true, createHide: true}
		,	{name: "closedAt", title: "关闭日期", listHide:true, readonly:true, createHide: true, isProfileHide: true}
    ,	{name: "updateAt", title: "更新日期", listHide:true, readonly:true, createHide: true, isProfileHide: true}
    ,	{name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'open') {
        entity.fieldClass.status = "label label-success"
        return "营业"
      } else if(entity.status === 'closed') {
        entity.fieldClass.status = "label label-warning"
        return "停业"
      } else {
        return "状态错误"
      }
    }, hide:true, createHide: true},
    {name:"location", title:"地理位置", listHide:true, createHide:true, hide:true}
  ]
  //delete a shop 
    $scope.remove = function (entity) {
  	  var obj = {
  		  id: entity.id,
  		  status: 'removed'
  	  }
  	  Shops.update(obj, function (result){
        var allShop = $scope.allShop;
        var id = obj.id;
        var i = undefined;
        for (var v = 0; v < allShop.length; v++) {
          if (id == allShop[v].id) {
            i = v;
            break;
          }
        }
        $scope.allShop.splice(i, 1);
        if ($scope.currentShowShop.shop.id == id) {
          $scope.currentShowShop.shop = $scope.allShop[0] || {id:'0'};
        }
  		  $scope.showList();
  	  }, function(err){
  		  console.log('err: \n' , err);
  	  });
    }

  $scope.showEdit = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/shop/edit.html";
    $scope.trackListPage.activeView = '';
  }
  $scope.update = function (entity) {
    var obj = entity;
    console.log('entity:\n', entity);
    if (entity.printers) {
      if (entity.printers.indexOf(',') == -1) {
        obj.printers = [entity.printers];
      } else {
        var printers = entity.printers.split(',') || [];
        obj.printers = printers;
      }
    } else {
      obj.printers = [];
    }

    obj.location.longitude = parseFloat($("#jindu").val());
    obj.location.latitude = parseFloat($("#weidu").val());
    var resource = new $scope.resource(obj);
    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update error:', err, entity)
    })
  };
  $scope.showProfile = function (entity) {
    if (entity.hasOwnProperty('printers')) {
      entity.printers = entity.printers.toString();
    } else {
      entity.printers = '';
    }
    if (!$scope.entity.hasOwnProperty('location')) {
      $scope.entity.location = {};
    }
    $scope.entity = entity || $scope.entity;
    $scope.activeView = "views/shop/profile.html";
    $scope.trackListPage.activeView = '';
  }
  $scope.editAddRes = function () {
    var obj = {
      "name": "桌子",
      "type": "table",
      "serviceability": 1,
      "code": "16",
      "codename": "桌号",
      "sceneID":"001"
    };
    $scope.entity.openRes = $scope.entity.openRes || [];
    $scope.entity.openRes.push(obj);
  };
  $scope.minusAddRes = function () {
    if ($scope.entity.openRes.length) {
      $scope.entity.openRes.pop();
    }
  }
  $scope.showCreate = function () {
    $scope.entityForCreate = {};
    $scope.activeView = "views/shop/create.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.create = function () {
    var obj = {
      code:$scope.entityForCreate.code,
      name:$scope.entityForCreate.name,
      address:$scope.entityForCreate.address,
      telephone: $scope.entityForCreate.telephone,
      merchantID:$scope.currentMerchant.merchant.id,
      status:'open',
      openRes:[],
      location:{
        latitude:0,
        longitude:0,
        precision:0
      },
      createdAt:Math.round(new Date().getTime() / 1000)
    }
    var newOne = new $scope.resource(obj);
    newOne.$save(function (result) {
      Shops.get({id:result.id}, function (result) {
        $scope.allShop.push(result);
        $scope.currentMerchant.merchant.shopIDs.push(result.id);
      }, function (err) {
        console.log('err:\n', err);
      })
      $scope.showList();
    }, function (err) {
      console.log('error:', err)
    })
  }
  
  $scope.showSecne2DimensionalCode = function (openRes) {
    console.log(openRes)
    $scope.imageUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+openRes.ticket
    $modal.open({
      templateUrl: 'Secne2DimensionalCode.html',
      scope: $scope
    })
  }

  $scope.paramsForDelete = 'removed';
  $scope.params['status'] = JSON.stringify({
 	  $ne: 'removed'
  });
  $scope.countQs['status'] = JSON.stringify({
 	  $ne: 'removed'
  });
 
  $scope.initMap = function (flag) {
    var longitude = 116.404;//默认经度
    var latitude = 39.915;//默认纬度
    if (!$scope.entity.hasOwnProperty('location')) {
      $scope.entity.location = {};
    }
    var location = $scope.entity.location;
    if (location.latitude && location.longitude) {
      generateMap(location.longitude, location.latitude); //之前已经编辑过
    } else {
      newMap(); //第一次编辑
    }
    // 第一次编辑时，使用navigator
    function newMap() {
      if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.getCurrentPosition(
          displayPosition,
          displayError,
          { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
      }
      else {
        generateMap(longitude, latitude); //若浏览器不支持navigator，则使用默认的经纬度。
      }
    }
    //第一次编辑经纬度时，先根据navigator重写默认经纬度，确认用户的大致范围
    function displayPosition(position) {
      latitude = parseFloat(position.coords.latitude);
      longitude = parseFloat(position.coords.longitude);
      accuracy = parseFloat(position.coords.accuracy);
      generateMap(longitude, latitude);
    }
    //发生错误则使用默认的经纬度
    function displayError() {
      generateMap(longitude, latitude);
    }
    function generateMap(longitude, latitude) {
      var map = new BMap.Map("map");          // 创建地图实例
      var point = new BMap.Point(longitude, latitude);  // 创建点坐标
      map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point);        // 创建标注
      map.addOverlay(marker);
      if (flag == 'no') {
        marker.disableDragging();
      } else {
        marker.enableDragging();
        marker.addEventListener("dragend", function(e){
          $("#jindu").val(e.point.lng);
          $("#weidu").val(e.point.lat);
        });
      }
    }
  }
 
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id; // find all shops that just belong to the currentMerchant
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  widthFunctions();
}