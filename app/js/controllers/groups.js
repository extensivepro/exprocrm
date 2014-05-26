/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-26
 */
function GroupsController($scope, Pagination, Groups, $timeout, $injector, $window, $modal, $log){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Groups;
  $scope.isGroup = true;
  $scope.statusForGroup = [
    {
      key:'',
      value: '全部'
    },
    {
      key:'start',
      value:'进行中'
    },
    {
      key:'end',
      value:'已结束'
    }
  ];
  $scope.currentStatus = {};
  $scope.currentStatus.status = $scope.statusForGroup[0];

  $scope.profileFields = [
    {name: "name", title: "活动名称"},
    {name: "items", title: "活动商品"},
    {name: "numbers", title: "子团人数"},
    {name: "status", title: "活动状态"},
    {name: "startTime", title: "开始时间"},
    {name: "endTime", title: "截止时间"},
  ];

  $scope.profileShortcuts = [
    {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-print", text: "打印", op:"print"}
  ];

  $scope.initDate = function () {
    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.formats = ['yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.initStart();
    $scope.initEnd();
  };
  $scope.initStart = function () {
    $scope.dtStart = new Date();
    $scope.openStart = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedStart = true;
    };
  };
  $scope.initEnd = function () {
    $scope.dtEnd = new Date((new Date()).getTime() + (86400*1000)) ;
    $scope.openEnd = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedEnd = true;
    };
  };
  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/orders/profile.html";
    $scope.trackListPage.activeView = '';
  };

  $scope.showCreate = function () {
    $scope.activeView = "views/groups/create.html";
    $scope.trackListPage.activeView = '';
    $scope.entity = {};
    $scope.entity.people = [];

  };

  $scope.create = function (entity) {
    if (!$scope.checked()) {
      return;
    }
    entity.start = Math.round($scope.dtStart.getTime() / 1000);
    entity.end = Math.round($scope.dtEnd.getTime() / 1000);
    entity.items = $scope.filterEntities || [];
    Groups.save(entity, function (r) {
      $scope.entity.id = r.id;
    }, function (err) {
      console.log('err:\n', err);
    });
  };

  $scope.alert = function (msg) {
    $window.alert(msg);
    return false;
  };
  $scope.checked = function () {
    var e = $scope.entity;
    var a = $scope.alert;
    if (!e.name) {
      a('活动名称不能为空!');
    } else if (isNaN(e.price)) {
      a('团购价填写有误!');
    } else if (isNaN(e.quantity)) {
      a('投入数量填写有误')
    } else if (isNaN(e.people[0] || isNaN(e.people[1]))) {
      a('子团人数填写有误')
    } else if ($scope.dtEnd.getTime()< $scope.dtStart.getTime()) {
      a('截止时间不能小于开始时间');
    } else if (!e.content) {
      a('活动内容不能为空!')
    } else {
      return true;
    }
  };

  $scope.fieldItem = [
    {name: "name", title: "品名"},
    {name: "price", title: "售价(元)", value:function(entity) {
      entity.fieldClass = entity.fieldClass || {}
      return (entity.price/100).toFixed(2)}, hide:false},
    {name: "tags", title: "类别", createHide: true, listHide: false, hide: false, isProfileHide:false, value: function (entity) {
      if(entity.tags && entity.tags.length > 0) {
        return entity.tags.join(',');
      } else {
        return "未分类"
      }
    }}
  ];

  $scope.addItem = function () {
    $scope.filterEntities = [];
    var modalInstance = $modal.open({
      templateUrl: 'addItem.html',
      controller: AddItemCtrl,
      resolve: {
        merchantID: function () {
          return $scope.currentMerchant.merchant.id;
        }
      }
    });

    modalInstance.result.then(function (filterEntities) {
      $scope.filterEntities = filterEntities;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.initForCrop = function () {
    var examples = [];
    examples.push(function () {
      $('#userpic').fileapi({
        url: window.restful.baseURL+'/upload?subdir=images&comments=&uniqueFilename=true',
        accept: 'image/*',
        imageSize: { minWidth: 400, minHeight: 400/*, maxWidth: 500, maxHeight: 500  */},
        elements: {
          active: { show: '.js-upload', hide: '.js-browse' },
          preview: {
            el: '.js-preview',
            width: 200,
            height: 200
          },
          progress: '.js-progress'
        },
        onSelect: function (evt, ui) {
          var file = ui.files[0];

          if (file) {
            $('#popup').modal({
              closeOnEsc: true,
              closeOnOverlayClick: false,
              onOpen: function (overlay) {
                $(overlay).on('click', '.js-upload', function () {
                  $.modal().close();
                  $('#userpic').fileapi('upload');
                });
                $('.js-img', overlay).cropper({
                  file: file,
                  bgColor: '#fff',
                  maxSize: [1280, 1280],
                  minSize: [400, 200],
                  selection: '50%',
                  onSelect: function (coords) {
                    $('#userpic').fileapi('crop', file, coords);
                  }
                });
              }
            }).open();
          }
        },
        onFileComplete: function (evt, uiEvt) {
          var obj = {
            id: $scope.entity.id,
            images: {
              $push: uiEvt.result[0].filename
            },
            imagesID:{
              $push: uiEvt.result[0].id
            }
          }
          Groups.update(JSON.stringify(obj), function (result) {
            $scope.showList();
          }, function (err) {
            console.log('err:\n', err);
          })

        }
      });
    });
    FileAPI.each(examples, function (fn) {
      fn();
    });
  }
/*  $timeout(function () {
    $scope.showCreate();
  }, 10);*/
};

var AddItemCtrl = function ($scope, $modalInstance, merchantID, Items) {
  $scope.fields = [
    {name: "name", title: "品名"},
    {name: "price", title: "售价(元)", value:function(entity) {
      entity.fieldClass = entity.fieldClass || {}
      return (entity.price/100).toFixed(2)}, hide:false},
    {name: "tags", title: "类别", createHide: true, listHide: false, hide: false, isProfileHide:false, value: function (entity) {
      if(entity.tags && entity.tags.length > 0) {
        return entity.tags.join(',');
      } else {
        return "未分类"
      }
    }}
  ];
  Items.query({merchantID: merchantID, $limit: 100000}, function (r) {
    $scope.entities = r.map(function (i) {
      i.price = (i.price/100).toFixed(2);
      if (i.tags) {
        i.tags = i.tags.toString();
      }
      return i;
    });
  }, function (err) {
    console.log('err:\n', err);
  });
  $scope.ok = function () {
    var ids = [];
    var  filterEntities = [];
    $('input[name="chbox"]:checked').each(function () {
      ids.push($(this).val());
    });
    if (!ids.length) {
      alert('你还没有选择任何内容');
      return;
    } else {
      var e = $scope.entities;
      for (var v = 0; v < ids.length; v++) {
        for (var a = 0; a < e.length; a++) {
          if (ids[v] == e[a].id) {
            filterEntities.push(e[a]);
            break;
          }
        }
      }
    };
    $modalInstance.close(filterEntities);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};