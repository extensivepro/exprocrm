function EmployeesController($scope, Employes, Users, Shops, Pagination, $timeout, $injector, Merchants){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Employes
	$scope.searchOptions.fields = ['name', 'role', 'phone', 'idcard']
  $scope.searchOptions.tooltip = "搜索员工姓名，职位，电话，身份证号"
	$scope.editView ="views/employee/edit.html"
  $scope.currentMerchant = {id: "e20dccdf039b3874"}
	// profile 
	$scope.profileAvatar = "img/avatar.jpg"
  $scope.fieldOperations.push({class: "btn btn-info", icon: "icon-info", op:"analysis"});
  $scope.profileFields = [
    {name: "userID", title: "用户ID", required: true, unlist: true, readonly:true, creatable:true, hide:true},
    {name: "shopID", title: "店面ID", required: true, unlist: true, readonly:true, creatable:true, hide:true},
    {name: "shopName", title: "所属店面", required: true,readonly:true, creatable:true, hide:true},
    {name: "jobNumber", title: "工号", required: true, readonly:true, creatable:true, hide:true},
    {name: "name", title: "姓名", required: true},
    {name: "role", title: "职务", value:function(entity){
      if(entity.role === 'cashier') return '收银员'
      if(entity.role === 'shopManager') return '店长'
      if(entity.role === 'owner') return '业主'
      return entity.role
    }, hide:true, required: true},
    {name: "email", title: "电子邮箱", unlist: true},
    {name: "phone", title: "电话", required: true},
    {name: "idcard", title: "身份证", required: true, readonly:true, creatable:true, hide:true},
    {name: "leaveAt", title: "离职日期", createHide: true, unlist: true, readonly:true, creatable:true, hide:true},
    {name: "createdAt", title: "入职日期", createHide: true, readonly:true, creatable:true, hide:true},
    {name: "username", title: "用户名", required: true, unlist: true},
    {name: "password", title: "密码", required: true, unlist: true},
    {name: "updateAt", title: "更新日期", createHide: true, unlist: true, readonly:true, creatable:true, hide:true},
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
    }, hide:true}
  ]

  $scope.showCreate = function() {
    var d = new Date();
    $scope.showEdit({createdAt: Math.round(d.getTime()/1000)})
  }
	// Restful
	$scope.create = function(entity) {
		if(!entity.shop._id) {
			return console.log('error: must have shop')
		}
		var newOne = new $scope.resource(entity)
		console.log(newOne)
		newOne.shop = entity.shop._id
		newOne.$save(function(one) {
			console.log("success",one)
			$scope.showList()
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
  $scope.refreshList = function () {
    var p = $scope.pagination
    var params = {$sort: $scope.sortOptions}
    for(var key in $scope.defaultParams) {
      params[key] = $scope.defaultParams[key]
    }
    if ($scope.searchOptions.text !== '' && $scope.searchOptions.fields.length > 0) {
      var filters = []
      $scope.searchOptions.fields.forEach(function (field) {
        var filter = {}
        filter[field] = {$regex: $scope.searchOptions.text}
        filters.push(filter)
      })
      params.$or = JSON.stringify(filters)
      $scope.$emit('LOAD')
      $scope.resource.query(params, function (results) {
        $scope.pagination.paginate(results.length)
        $scope.totalSearch = results.length
        $scope.$emit('UNLOAD')
        console.log($scope.totalSearch);

        params.$skip = (p.iPage - 1) * p.iLength
        params.$limit = p.iLength

        if (params.$skip == -10 || $scope.totalSearch == 0){
          $scope.$emit('NOSEARCHBACK')
          params.$skip = 0
          p.iStart = 1
          p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
          })
        }
        else {
          $scope.$emit('SEARCHBACK')
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
          })
        }
        if (! $scope.totalSearch == 0)
          $scope.$emit('SEARCHBACK')
      })
    } else {
      $scope.$emit('LOAD')
      $scope.$emit('SEARCHBACK')
      if ($scope.total == 0) {
        $scope.$emit('LOAD')
        $scope.resource.count(params, function (result){
          $scope.total = result.count
          $scope.pagination.paginate(result.count)
        });
      } else {
        $scope.pagination.paginate($scope.total)
      }
      params.$skip = (p.iPage - 1) * p.iLength
      params.$limit = p.iLength;
      // 通过id获得当前的商户
      Merchants.query({'id':$scope.currentMerchant.id}, function (merchant) {
        var shopIDs = merchant.shopIDs;
        params.shopID= JSON.stringify({$in:shopIDs}); // 只查询当前商户所包含的员工
        if (params.$skip == -10){
          params.$skip = 0
          p.iStart = 1
          p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
            $scope.$emit('UNLOAD')
          })
        } else {
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
            $scope.$emit('UNLOAD')
          })
        }
      });
    }
  }
}