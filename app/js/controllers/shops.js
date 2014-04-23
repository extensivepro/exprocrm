function ShopsController($scope, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Shops

	$scope.searchOptions.fields = ['name', 'telephone']
  $scope.searchOptions.tooltip = "请输入商店名称或手机号码"

	$scope.editView ="views/shop/edit.html"
	
	// profile 
	$scope.profileFields = [
    {name: "code", title: "店面编码", required: true, listHide: true, hide: true}
		,	{name: "name", title: "店名", required: true, hide: true}
    , {name: "merchantID", title: "商户ID", listHide:true, hide: true, isProfileHide: true, createHide: true}
		, {name: "address", title: "地址", required: true, hide: true}
		, {name: "printers", title: "打印机", required: true, hide: true, listHide:true, createHide:true, value:function(entity){
      if (entity.printers) {
        return entity.printers;
      } else {
        return '尚未配置打印机';
      }
    }}
    , {name:"openRes", title:"开业资源", listHide:true, hide:true, createHide:true}
		, {name: "telephone", title: "电话号码", hide: true}
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


  // bussiness
  $scope.resetPassword = function(entity) {
    entity.password = "654321"
    $scope.update(entity)
  }
  $scope.update = function (entity) {
    var obj = entity;
    console.log('entity:\n', entity);
    var printers = entity.printers.split(',') || [];
    obj.printers = printers;
    obj.location.latitude = parseFloat($("#jindu").val());
    obj.location.longitude = parseFloat($("#weidu").val());
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
      "codename": "桌号"
    };
    $scope.entity.openRes = $scope.entity.openRes || [];
    $scope.entity.openRes.push(obj);
  };
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
      $scope.showList()
    }, function (err) {
      console.log('error:', err)
    })
  };

  $scope.initMap = function (flag) {
    var longitude = 116.404;//默认经度
    var latitude = 39.915;//默认纬度
    if (!$scope.entity.hasOwnProperty('location')) {
      $scope.entity.location = {};
    }
    var location = $scope.entity.location;
    if (location.latitude && location.longitude) {
      generateMap(location.latitude, location.longitude); //之前已经编辑过
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