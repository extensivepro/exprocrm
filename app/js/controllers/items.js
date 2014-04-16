function ItemsController($scope, Items, Pagination, $timeout, $injector, $window, $fileUploader, Merchants, $resource){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.searchOptions.tooltip = "请输入商品名称"
  $scope.editView = "views/item/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, listHide: true, hide: true, isProfileHide:true, createHide: true},
    {name: "name", title: "商品名", required: true, hide:false},
    {name: "tags", title: "类别", createHide: true, listHide: true, hide: false, isProfileHide:false, value: function (entity) {
      return entity.tags.toString() || '';
    }},
    {name: "price", title: "售价", required: true, value:function(entity) {
      entity.fieldClass = entity.fieldClass || {}
      return (entity.price/100).toFixed(2)}, hide:false},
    {name: "model", title: "型号", createHide:true, hide:false},
    {name: "code", title: "编号", required: true, hide: true, createHide:true},
    {name: "mnemonicCode", title: "助记码", listHide: true, createHide:true, hide:true, isProfileHide:true},
    {name: "desc", title: "描述", listHide: true, hide:false},
    {name: "createdAt", title: "创建日期", createHide: true, hide: true, createHide:true},
    {name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'sale') {
        entity.fieldClass.status = "label label-success"
        return "上架"
      } else if(entity.status === 'removed') {
        entity.fieldClass.status = "label label-warning"
        return "下架"
      } else {
        return entity.status
      }
    }, hide:true, createHide: true},
    {name: "images", title: "照片", createHide: false, listHide: true, hide: true, isProfileHide:false, isImg:true, value:function (entity) {
      return entity.images.toString();
    }},
    {name: "updatedAt", title: "更新日期", createHide: false, listHide: true, hide: true, isProfileHide:true}
  ];

  // delete a item
  $scope.remove = function (entity) {
    var obj = {
      id: entity.id,
      status: 'removed'
    }
    Items.update(obj, function (result) {
      $scope.showList();
    }, function (err) {
      console.log('err:\n', err);
    });
  }

  // three params for upload img
  var subdir = 'images';
  var comments = '';
  var uniqueFilename = false;


  // update a item
  $scope.update = function (entity) {
    var tags = [];
    tags.push(entity.tags);
    var obj = entity;
    obj.tags = tags;
    var resource = new $scope.resource(obj);
    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update error:', err, entity)
    })
  }

  // init for edit page
  $scope.showEdit = function (entity) {
    $scope.entity = entity
    $scope.activeView = "views/item/edit.html";
    $scope.showChangePic = false
  }

  // in edit page we can change the pic of the item
  $scope.showChangePic = false
  $scope.changePic = function () {
    $scope.showChangePic = !$scope.showChangePic;
    var uploaderForEdit = $scope.uploaderForEdit = $fileUploader.create({
      scope: $scope,
      url: window.restful.baseURL + '/upload?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename
    });
    uploaderForEdit.bind('success', function(event, xhr, item, res) {
      var obj = {
        id: $scope.entity.id,
        images: {
          $push: item.file.name
        },
        imagesID:{
          $push: res[0].id
        }
      }
      Items.update(JSON.stringify(obj), function (result) {
      }, function (err) {
        console.log('err:\n', err);
      })
    });
    uploaderForEdit.bind('completeall', function(event, items) {
      $scope.showList();
      uploaderForEdit = $scope.uploaderForEdit = {};
    });
  };

  // method for change the item's pic
  $scope.uploadForEdit = function () {
    var qsItem = {
      "id": $scope.entity.id,
      "images": {$pullAll: $scope.entity.images},
      "imagesID": {$pullAll: $scope.entity.imagesID}
    }
    Items.update(JSON.stringify(qsItem), function (result) {
      var Upload = $resource(window.restful.baseURL+'/upload/:id', {id:'@id'});
      var arr = $scope.entity.imagesID || [];
      var jici = 0;
      arr.forEach(function (id) {
        Upload.delete({id: id}, function () {
          jici++;
          if (jici == arr.length) {
            $scope.uploaderForEdit.uploadAll();
          }
        });
      })
    }, function (err) {
      console.log('err:\n', err);
    })
  }

  // init for profile page
  $scope.showProfile = function (entity) {
    Items.get({id:entity.id}, function (result) {
      $scope.entity = result;
      $scope.activeView = "views/item/itemProfile.html";
      $scope.imgs = ($scope.entity.images).map(function (img) {
        return window.restful.baseImgSrcURL + img;
      });
    }, function (err) {
      console.log('err:\n', err);
    });
  }

  // init for create page
  $scope.showCreate = function () {
    $scope.entity = {};
    $scope.isShowUpload = false;
    $scope.isHideButton = false;
    $scope.info = false;
    $scope.alert = '';
    $scope.msg = '';
    $scope.activeView = "views/item/create.html";
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: window.restful.baseURL + '/upload?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename
    });
    uploader.bind('success', function(event, xhr, item, res) {
      var obj = {
        id: $window.item.id,
        images: {
          $push: item.file.name
        },
        imagesID:{
          $push: res[0].id
        }
      }
      Items.update(JSON.stringify(obj), function (result) {
      }, function (err) {
        console.log('err:\n', err);
      })
    });
    uploader.bind('completeall', function(event, items) {
      $scope.showList();
      uploader = $scope.uploader = {};
    });
    Merchants.get({id:$scope.currentMerchant.merchant.id}, function (result) {
      $scope.merchantItemTags = result.itemTags || [];
    }, function (err) {
      console.log('err:\n', err);
    })
  }

  // method for create a item
  $scope.create = function (entity) {
    entity.createdAt = Math.round(new Date().getTime() / 1000);
    entity.merchantID = $scope.currentMerchant.merchant.id;
    var obj = {
      createdAt : Math.round(new Date().getTime() / 1000),
      merchantID: $scope.currentMerchant.merchant.id,
      code: $scope.entity.code,
      mnemonicCode:'',
      name: $scope.entity.name,
      price: $scope.entity.price,
      desc: $scope.entity.desc,
      model: $scope.entity.model,
      tags: [],
      images:[],
      imagesID:[]
    };
    obj.tags.push($scope.entity.tags);
    var tempArr = [];
    obj.tags.forEach(function (tag) {
      if ($scope.merchantItemTags.indexOf(tag) == -1) {
        tempArr.push(tag);
      }
    });
    if (tempArr.length) {
      var qsMerchant = {
        "id": $scope.currentMerchant.merchant.id,
        "itemTags": {$pushAll: tempArr}
      }
      Merchants.update(JSON.stringify(qsMerchant), function (result) {
      }, function (err) {
        console.log('err:\n', err);
      })
    }
    Items.save(obj, function (result) {
      $window.item = {};
      $window.item.id = result.id;
      $window.item.tags = result.tags;
      $scope.isShowUpload = true;
      $scope.isHideButton = true;
      $scope.info = true;
      $scope.alert = 'alert alert-success';
      $scope.msg = '菜品信息创建成功，请上传菜品照片，完成最后的创建';
      $timeout(function () {
        $scope.info = false;
      }, 2000);
    }, function (err) {
      $scope.info = true;
      $scope.alert = 'alert alert-danger';
      $scope.msg = '菜品信息创建失败';
      $timeout(function () {
        $scope.info = false;
      }, 4000);
    });
  }

  // some params for list page
  $scope.params['status'] = JSON.stringify({
    $ne: 'removed'
  });
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.defaultString = "name";
  widthFunctions();
}
