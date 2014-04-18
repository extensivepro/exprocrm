function EmployeesController($scope, Employes, Users, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Employes
	$scope.searchOptions.fields = ['name', 'phone', 'idcard']
  $scope.searchOptions.tooltip = "请输入员工姓名、手机号、身份证号"
	$scope.editView ="views/employee/edit.html"
	// profile 
	$scope.profileAvatar = "img/avatar.jpg"
  $scope.fieldOperations.push({class: "btn btn-info", icon: "fa fa-info", op:"analysis"});
  $scope.profileFields = [
    {name: "jobNumber", title: "工号", required: true, creatable:true, hide: true, createHide: true},
    {name: "name", title: "姓名", required: true, hide: true, createHide: true},
    {name: "role", title: "职务", value:function(entity){
      if(entity.role === 'cashier') return '收银员'
      if(entity.role === 'shopManager') return '店长'
      if(entity.role === 'owner') return '业主'
      return entity.role
    }, hide:true, createHide: true},
    {name: "idcard", title: "身份证", required: true, readonly:true, creatable:true, hide:true, createHide: true},
    {name: "phone", title: "手机号码", required: true, createHide: true, hide:true},
    {name: "email", title: "电子邮箱", listHide: true, createHide: true, hide:true},
    {name: "createdAt", title: "入职日期", createHide: true, readonly:true, creatable:true, hide:true},
    {name: "leaveAt", title: "离职日期", createHide: true, listHide: true, readonly:true, creatable:true, hide:true,
     leaverNoHide: function(entity) {
      if(entity.status === 'leave') {
        return false
      } else if (entity.status === 'active') {
        return true
      }
    }},
    {name: "password", title: "密码", listHide: true, hide: true, isProfileHide: true, createHide: true},
    {name: "updateAt", title: "更新日期", createHide: true, listHide: true, readonly:true, creatable:true, hide:true, isProfileHide: true},
    {name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'active') {
        entity.fieldClass.status = "label label-success"
        return "正常"
      } else if(entity.status === 'leave') {
        entity.fieldClass.status = "label label-warning"
        return "离职"
      } else {
        return entity.status
      }
    }, hide:true, createHide: true}
  ]
  // delete a Employes
  $scope.remove = function (entity) {
    var obj = {
      id: entity.id,
      status: 'removed'
    }
    Employes.update(obj, function (result) {
      $scope.showList();
    }, function (err) {
      console.log('err:\n', err);
    });
  }

  //Formatting date
  $scope.valueOfKeyString = function (entity, keyString) {
    var v = entity
    var keys = keyString.split('.')
    var theKey = keys[0]
    keys.forEach(function (key) {
      theKey = key
      v = v[key]
    })
    if (theKey === 'createdAt' || theKey === 'leaveAt' || theKey === 'updateAt') {
      v = new Date(v * 1000).toLocaleString()
    }
    return v
  }
  
  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
  }
	// Restful
	$scope.create = function(entity) {
		$scope.entity.role = "cashier"
    $scope.entity.shopID = $scope.currentShowShop.shop.id
		var newOne = new $scope.resource(entity)
		console.log(newOne)
		newOne.$save(function(one) {
			console.log("success",one)
			$scope.showList()
      Employes.get({id:newOne.id}, function(employee) {
        console.log(employee)
      })
		},function(err){
			console.log('error:', err)
		})
	}
	
	// bussiness
	$scope.shops = []
	$scope.fetchShops = function() {
		var s = $scope.entity.shop
		Shops.list(function(result){
			$scope.shops = result.entities
			if(s) {
				var inArray = false
				for(var i in $scope.shops) {
					if($scope.shops[i].name === s.name) {
						$scope.entity.shop = $scope.shops[i]
						inArray = true
						break;
					}
				}
				if(!inArray) {
					$scope.shops.push(s)
					$scope.entity.shop = s
				}
			} else {
				$scope.entity.shop = $scope.shops[0]
			}
		})
	};
  $scope.analysis = function(entity) {
    $scope.entity = entity;
    $scope.activeView = "views/Analysis/employeeAnalysis.html"
  }
  $scope.paramsForDelete = 'removed';
  $scope.params['status'] = JSON.stringify({
	  $ne: 'removed'
  });
  $scope.countQs['status'] = JSON.stringify({
	  $ne: 'removed'
  })
  $scope.$watch('currentShowShop.shop', function () {
    $scope.params['shopID'] = $scope.currentShowShop.shop.id;// default use the first shop of the currentMerchant
    $scope.countQs['shopID'] = $scope.currentShowShop.shop.id;
    $scope.refreshList();
  })
//  $scope.params['shopID'] = JSON.stringify({$in:$scope.currentMerchant.shopIDs});
//  $scope.countQs['shopID'] = JSON.stringify({$in:$scope.currentMerchant.shopIDs});
  $scope.defaultString = "name";
  $scope.showOptions = true;
}