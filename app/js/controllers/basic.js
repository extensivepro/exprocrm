function BasicController($scope, Pagination, $modal, $log) {
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
    {class: "btn btn-success", icon: "fa fa-file fa-5x", op: "showProfile", title:'详情'}
    ,
    {class: "btn btn-info", icon: "fa fa-edit fa-5x", op: "showEdit",title:'编辑'}
    ,
    {class: "btn btn-danger", icon: "fa fa-trash-o fa-5x", op: "remove", title:'删除'}
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
    if ($scope.countQs.hasOwnProperty('merchantID') || $scope.countQs.hasOwnProperty('$or') || $scope.countQs.hasOwnProperty('shopID') || $scope.countQs.hasOwnProperty('merchant.merchantID') || $scope.countQs.hasOwnProperty('owner.id')) {
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
        $scope.percent= 100 / $scope.fields.length ;
      });
    }
  }

  $scope.$watch('search.text', function () {
    if (!$scope.search.text) {
      delete $scope.params['$or'];
      delete $scope.countQs['$or'];
    }
    else {
      $scope.filters = [];
      $scope.searchOptions.fields.forEach(function(field) {
        var filter = {};
        filter[field] = {$regex:$scope.search.text};
        $scope.filters.push(filter);
      })
      $scope.params.$or = JSON.stringify($scope.filters);
      $scope.countQs.$or = JSON.stringify($scope.filters);
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
      return !field.listHide
    });
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

  $scope.showCheckbox = function () {
    $scope.showCbx = !$scope.showCbx;
  }
  $scope.checked = false;
  // 批量删除
  $scope.deleteByIds = function () {
    var ids = [];
    $('input[name="chbox"]:checked').each(function () {
      ids.push($(this).val());
    });
    if (!ids.length) {
      alert('你还没有选择任何内容');
    } else {
      if (confirm("确定要删除吗？")) {
        $scope.parameter = {};
        $scope.parameter.id = JSON.stringify({$in:ids})
        $scope.resource.put($scope.parameter, function (result) {
          console.log('result:', result);
          $scope.refreshList()
        })

      }
    }
  }

  $scope.open = function (obj) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        obj: function () {
          return obj;
        }
      }
    });

    modalInstance.result.then(function (op) {
      var self = $scope.operateFunc;
      $scope.operateFunc = function (op) {
        $scope[op](obj);
      }
      $scope.operateFunc(op);
      $scope.operateFunc = self;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  $scope.doNothing = function ($event) {
    $event.stopPropagation();
    return;
  }
}

var ModalInstanceCtrl = function ($injector, $scope, $modalInstance, obj) {
  $scope.fieldOperations = [
    {class: "btn btn-success", icon: "fa fa-file fa-5x", op: "showProfile", title:'详情'}
    ,
    {class: "btn btn-info", icon: "fa fa-edit fa-5x", op: "showEdit",title:'编辑'}
    ,
    {class: "btn btn-danger", icon: "fa fa-trash-o fa-5x", op: "remove", title:'删除'}
  ]
  $scope.cols = "col-lg-4";
  if (obj.hasOwnProperty('owner')) { // this is a table of merchant
    $scope.fieldOperations.push({class: "btn btn-info", icon: "fa fa-home fa-5x", op: "setCurrentMercants", title:"设置为当前默认商户"});
    $scope.cols = "col-lg-3";
  }
  $scope.operateFun = function (op) {
    $modalInstance.close(op);
  }
};
