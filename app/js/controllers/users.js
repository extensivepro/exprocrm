function UsersController($scope, Users, Pagination, $timeout, $injector){
	$injector.invoke(BasicController, this, {$scope: $scope});
  $scope.activeView = "views/basicProfile.html"
	$scope.resource = Users
	$scope.searchOptions.fields = ['username']
	$scope.editView = "views/user/edit.html"

	// profile 
	$scope.profileShortcuts = [
			{"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-edit", text: "编辑", op:"showEdit"}
	]
  
	$scope.profileAvatar = "img/avatar.jpg"
	$scope.profileFields = [
			{name: "username", title: "用户名", readonly:true}
		, {name: "name", title: "姓名"}
		, {name: "idcard", title: "身份证"}
		, {name: "phone", title: "电话"}
		,	{name: "email", title: "电子邮箱"}
		,	{name: "createdAt", title: "注册日期", readonly:true}
		,	{name: "male", title: "性别", value:function(entity){
				if(entity.male) {
					return "男"
				} else if(entity.male == false) {
					return "女"
				} else {
					return "保密"
				}
		}, hide:true}	
	]

  $scope.showEdit = function (entity) {
    var profile = entity || $scope.entity
    $scope.entity = {}
    for(var key in profile) {
      $scope.entity[key] = profile[key]
    }
    $scope.activeView = "views/basicEdit.html"
  }

	$scope.cancelEdit = function() {
		$scope.showProfile()
	}
  
  $scope.update = function (entity) {
    var resource = new $scope.resource(entity)

    resource.$update(function (err) {
      $scope.me = resource
  		$scope.showProfile()
    }, function (err) {
      console.log('update user error:', err)
    })
  }

  $scope.showProfile = function (entity) {
    $scope.entity = $scope.me
    $scope.activeView = "views/basicProfile.html"
  }

  $scope.init = function () {
    $scope.$watch('me', function(scope, newValue, oldValue) {
      $scope.showProfile()
    })
  }

  widthFunctions();
}