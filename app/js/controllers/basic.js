function BasicController($scope, $rootScope, Pagination, $timeout) {
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
    $scope.entity = entity || $scope.entity;
    $scope.activeView = "views/basicEdit.html"
  }
  
  $scope.showCreate = function () {
    $scope.showEdit({createdAt: Date()})
  }

  $scope.showCreateBasic = function (entity) {
    $scope.entity = entity || $scope.entity;
    $scope.activeView = "views/basicCreate.html"
  }

  $scope.showList = function () {
    $scope.activeView = "views/basicList.html"
    $scope.refreshList()
  }

  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity;
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
    {class: "btn btn-success", icon: "icon-file", op: "showProfile"}
    ,
    {class: "btn btn-info", icon: "icon-edit", op: "showEdit"}
    ,
    {class: "btn btn-danger", icon: "icon-trash", op: "remove"}
  ]

  // profile
  $scope.profileShortcuts = [
    {class: "box quick-button-small span1", icon: "icon-edit", text: "编辑", op: "showEdit"}
    ,
    {class: "box quick-button-small span1", icon: "icon-trash", text: "删除", op: "remove"}
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
  $scope.total = 0;
  $scope.totalSearch = 0;

  // Restful
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
      params.$limit = p.iLength
      params.shopID = $scope.shopID; // just use for employees
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
    }
  }

  $scope.$on('NOSEARCHBACK', function() {
    $scope.noSearchBack = true
  });
  $scope.$on('SEARCHBACK', function() {
    $scope.noSearchBack = false
  });
  $scope.$on('LOAD', function () {
    $scope.loading = true
  });
  $scope.$on('UNLOAD', function () {
    $scope.loading = false
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
    delete resource.owner;
    delete resource.shopIDs;

    console.log(resource);

    delete resource.owner;
    delete resource.shopIDs;

    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update user error:', err)
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