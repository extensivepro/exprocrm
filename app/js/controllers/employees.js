function EmployeesController($scope, Employes, Users, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Employes
	$scope.searchOptions.fields = ['user.name']
	$scope.editView ="views/employee/edit.html"

	// profile 
	$scope.profileAvatar = "img/avatar.jpg"
  $scope.fieldOperations.push({class: "btn btn-info", icon: "icon-info", op:"analysis"});
  $scope.profileFields = [
    {name: "userID", title: "用户ID", required: true, unlist: true, readonly:true, creatable:true, hide:true},
    {name: "shopID", title: "店面ID", required: true, unlist: true, readonly:true, creatable:true, hide:true},
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
}