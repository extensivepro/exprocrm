function EmployeesController($scope, Employes, Users, Shops, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
	$scope.resource = Employes
	$scope.searchOptions.fields = ['user.name']
	$scope.editView ="views/employee/edit.html"

	// profile 
	$scope.profileAvatar = "img/avatar.jpg"

  $scope.profileFields = [
    {name: "userID", title: "用户ID", unlist: true, readonly:true, creatable:true, hide:true},
    {name: "shopID", title: "编号", unlist: true, readonly:true, creatable:true, hide:true},
    {name: "name", title: "姓名"},
    {name: "status", title: "状态", value:function(entity){
      if(entity.status === 'active') {
        this.class = "label label-success"
        return "正常"
      } else if(entity.status === 'removed') {
        this.class = "label label-warning"
        return "离职"
      } else {
        return entity.status
      }
    }, hide:true},
    {name: "role", title: "职务", value:function(entity){
      if(entity.role === 'cashier') return '收银员'
      if(entity.role === 'shopManager') return '店长'
      if(entity.role === 'owner') return '业主'
      return entity.role
    }, hide:true},
    {name: "jobNumber", title: "工号", readonly:true, creatable:true, hide:true},
    {name: "email", title: "电子邮箱"},
    {name: "phone", title: "电话"},
    {name: "idcard", title: "工号", readonly:true, creatable:true, hide:true},
    {name: "leaveAt", title: "离职日期", unlist: true, readonly:true, creatable:true, hide:true},
    {name: "createdAt", title: "创建日期", readonly:true, creatable:true, hide:true},
    {name: "username", title: "用户名"},
    {name: "password", title: "密码", unlist: true},
    {name: "updateAt", title: "更新日期", unlist: true, readonly:true, creatable:true, hide:true}
  ]

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
	}
}