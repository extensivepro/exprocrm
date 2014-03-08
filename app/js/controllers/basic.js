function BasicController($scope, Pagination) {
  $scope.activeView = "views/basicList.html"
  $scope.resource = undefined
  $scope.searchFields = []
  $scope.editView = undefined
  $scope.defaultParams = {}
  $scope.searchOptions = {
    text: '',
    tooltip: '',
    fields: []
  }
  $scope.sortOptions = {createdAt:-1}
    
  // route
  $scope.showEdit = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/basicEdit.html"
  }
  
  $scope.showCreate = function () {
    $scope.showEdit({createdAt: Date()})
  }

  $scope.showCreateBasic = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/basicCreate.html"
  }

  $scope.showList = function () {
    $scope.activeView = "views/basicList.html"
    $scope.refreshList()
  }

  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/basicProfile.html"
  }

  $scope.cancelEdit = function () {
    $scope.showList()
  }

  $scope.operateFunc = function (entity, op) {
    $scope[op](entity);
  }

  // list
  $scope.fields = []
  $scope.fieldOperations = [
    {class: "btn btn-success", icon: "fa fa-file", op: "showProfile", title:'详情'}
    ,
    {class: "btn btn-info", icon: "fa fa-edit", op: "showEdit",title:'编辑'}
    ,
    {class: "btn btn-danger", icon: "fa fa-trash-o", op: "remove", title:'删除'}
  ]

  // profile
  $scope.profileShortcuts = [
    {class: "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-edit", text: "编辑", op: "showEdit"}
    ,
    {class: "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-trash-o", text: "删除", op: "remove"}
  ]
  $scope.profileFields = []

  $scope.shouldOpenConfirmCreate = false
  $scope.entities = []
  $scope.entity = {}


  $scope.$watch('pagination.iLength', function () {
    $scope.refreshList()
  })
  $scope.$watch('pagination.iPage', function () {
    $scope.refreshList();
  })
  $scope.pagination = Pagination
  $scope.totalSearch = 0;

  // Restful
  $scope.params = {};
  $scope.countQs = {};
  $scope.search = {};
  $scope.refreshList = function () {
    // query for getting count
    $scope.resource.count($scope.countQs, function (result) {
      $scope.pagination.paginate(result.count)
    });
    // query for getting result
    var p = $scope.pagination;
    $scope.params.$sort = $scope.sortOptions;
    $scope.params.$skip = (p.iPage - 1) * p.iLength;
    $scope.params.$limit = p.iLength;
    $scope.resource.query($scope.params, function (results) {
      $scope.entities = results;
    });
  }

  $scope.$watch('search.text', function () {
    if (!$scope.search.text) {
      delete $scope.params[$scope.defaultString];
      delete $scope.countQs[$scope.defaultString];
    }
    else {
      $scope.params[$scope.defaultString] = $scope.search.text;
      $scope.countQs[$scope.defaultString] = $scope.search.text;
    }
  });
  $scope.create = function (entity) {
    var newOne = new $scope.resource(entity);
    newOne.$save(function (user) {
      console.log("success", user)
      $scope.showList()
    }, function (err) {
      console.log('error:', err)
    })
  }

  $scope.update = function (entity) {
    var resource = new $scope.resource(entity)

    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update error:', err, entity)
    })
  }

  $scope.remove = function (entity) {
    var resource = new $scope.resource(entity)
    resource.$remove(function () {
      if ($scope.activeView === 'views/basicProfile.html') {
        $scope.showList()
      } else {
        var iPage = $scope.pagination.iPage
        $scope.pagination.paginate($scope.pagination.iTotal - 1)
        if (iPage === $scope.pagination.iPage) {
          $scope.refreshList()
        }
      }
    }, function (err) {
      console.log('Remove user error:', err)
    })
  }

  $scope.init = function () {
    $scope.pagination.iPage = 1
    $scope.fields = $scope.profileFields.filter(function (field) {
      return !field.unlist
    })
  }

  $scope.valueOfKeyString = function (entity, keyString) {
    var v = entity
    var keys = keyString.split('.')
    var theKey = keys[0]
    keys.forEach(function (key) {
      theKey = key
      v = v[key]
    })
    if (theKey === 'createdAt' || theKey === 'updateAt') {
      v = new Date(v * 1000).toLocaleString()
    }
    return v
  }
}