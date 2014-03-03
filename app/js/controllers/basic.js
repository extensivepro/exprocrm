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
    {class: "btn btn-success", icon: "fa fa-file", op: "showProfile"}
    ,
    {class: "btn btn-info", icon: "fa fa-edit", op: "showEdit"}
    ,
    {class: "btn btn-danger", icon: "fa fa-trash-o", op: "remove"}
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
  $scope.total = 0;
  $scope.totalSearch = 0;

  // Restful
  $scope.params = {};
  $scope.refreshList = function () {
    var p = $scope.pagination
    $scope.params.$sort = $scope.sortOptions;
    for(var key in $scope.defaultParams) {
      $scope.params[key] = $scope.defaultParams[key]
    }
    if ($scope.searchOptions.text !== '' && $scope.searchOptions.fields.length > 0) {
      var filters = []
      $scope.searchOptions.fields.forEach(function (field) {
        var filter = {}
        filter[field] = {$regex: $scope.searchOptions.text}
        filters.push(filter)
      })
      $scope.params.$or = JSON.stringify(filters)
      $scope.$emit('LOAD')
      $scope.resource.query($scope.params, function (results) {
        $scope.pagination.paginate(results.length)
        $scope.totalSearch = results.length
        $scope.$emit('UNLOAD')
        console.log($scope.totalSearch);

        $scope.params.$skip = (p.iPage - 1) * p.iLength
        $scope.params.$limit = p.iLength

        if ($scope.params.$skip == -10 || $scope.totalSearch == 0){
          $scope.$emit('NOSEARCHBACK')
          $scope.params.$skip = 0
          p.iStart = 1
          p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
          $scope.resource.query($scope.params, function (results) {
            $scope.entities = results;
          })
        }
        else {
          $scope.$emit('SEARCHBACK')
          $scope.resource.query($scope.params, function (results) {
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
        $scope.resource.count($scope.params, function (result){
          $scope.total = result.count
          $scope.pagination.paginate(result.count)
        });
      } else {
        $scope.pagination.paginate($scope.total)
      }
      $scope.params.$skip = (p.iPage - 1) * p.iLength
      $scope.params.$limit = p.iLength
      if ($scope.params.$skip == -10){
        $scope.params.$skip = 0
        p.iStart = 1
        p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
        $scope.resource.query($scope.params, function (results) {
          $scope.entities = results;
          $scope.$emit('UNLOAD')
        })
      } else {
        $scope.resource.query($scope.params, function (results) {
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