function ItemsController($scope, Items, Pagination, $timeout, $injector, $window, $fileUploader, Merchants, $resource, $modal, $log){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.searchOptions.tooltip = "请输入商品名称"
  $scope.editView = "views/item/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, listHide: true, hide: true, isProfileHide:true, createHide: true},
    {name: "code", title: "编码", required: true, hide: true, createHide:true, csv:'商品的一维码或者自定义编号，例如：690012341234'},
    {name: "name", title: "品名", required: true, hide:false, csv:'商品的名称，例如儿童上衣'},
    {name: "model", title: "型号", createHide:true, hide:false, csv:'110cm 白色'},
    {name: "itemSkus", title: "成本", createHide:true, hide:true, value: function (entity) {
      if (entity.itemSkus) {
        return (entity.itemSkus.fold / 100).toFixed(2);
      } else {
        return '0.00';
      }
    }},
    {name: "price", title: "售价", required: true, value:function(entity) {
      entity.fieldClass = entity.fieldClass || {}
      return (entity.price/100).toFixed(2)}, hide:false, csv:78.00},
    {name: "mnemonicCode", title: "助记码", listHide: true, createHide:true, hide:true, isProfileHide:true, csv:'自己定义的帮助记忆的短码例如：1234'},
    {name: "tags", title: "类别", createHide: true, listHide: false, hide: false, isProfileHide:false, value: function (entity) {
      if(entity.tags && entity.tags.length > 0) {
        return entity.tags.join(',');
      } else {
        return "未分类"
      }
    }, csv:'童装'},
    {name: "desc", title: "描述", listHide: true, hide:false, csv:'对商品的详细描述，例如：夏季新款'},
    {name: "createdAt", title: "创建日期", createHide: true, hide: true, createHide:true},
    {name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'sale') {
        entity.fieldClass.status = "label label-success"
        return "上架"
      } else if(entity.status === 'desale') {
        entity.fieldClass.status = "label label-warning"
        return "下架"
      } else {
        return entity.status
      }
    }, hide:true, createHide: true},
    {name: "images", title: "照片", createHide: false, listHide: true, hide: true, isProfileHide:true, isImg:true, value:function (entity) {
      if (entity.hasOwnProperty('images')) {
        return entity.images.toString();
      } else {
        return '尚未上传照片';
      }
    }},
    {name: "updatedAt", title: "更新日期", createHide: false, listHide: true, hide: true, isProfileHide:true}
  ];
  
  $scope.listToolbarView = "views/item/listToolbar.html"
  $scope.importHeaders = []
  var sample = {}
  $scope.cvsProfiles = $scope.profileFields.filter(function (item) {
    if(item.csv) {
      $scope.importHeaders.push(item.title)
      sample[item.title] = item.csv
    }
    return item.csv
  })
  $scope.importSampleCsv = [sample]

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
  var uniqueFilename = true;


  // update a item
  $scope.update = function (obj) {
    var entity = angular.copy(obj);
    var tags = [];
    tags[0] = entity.tags;
    delete entity.tags;
    entity.tags = tags;
    entity.price = parseFloat(entity.price*100);
    var resource = new $scope.resource(entity);
    resource.$update(function (err) {
      $scope.showList()
    }, function (err) {
      console.log('update error:', err, entity)
    })
  }

  // init for edit page
  $scope.showEdit = function (entity) {
    $scope.activeView = "views/item/edit.html";

    Merchants.get({id:$scope.currentMerchant.merchant.id}, function (result) {
      $scope.merchantItemTags = result.itemTags || [];
      if (!entity.hasOwnProperty('tags')) {
        entity.tags = [''];
      }
      entity.price = (entity.price/100).toFixed(2);
      var tag = entity.tags[0];
      delete  entity.tags;
      entity.tags = tag;
      $scope.entity = entity;
      $scope.trackListPage.activeView = '';
      $scope.showChangePic = false
    }, function (err) {
      console.log('err:\n', err);
    });

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
          $push: res[0].filename
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
    var queue = $scope.uploaderForEdit.queue;
    if (queue.length > 3) {
      alert('上传图片不能超过3张！');
      return;
    }
    for (var i = 0; i < queue.length; i++) {
      if ((queue[i].file.size/1000000)>2) {
        alert('图片大小必须小于2M');
        return;
      }
    }
    if ($scope.entity.hasOwnProperty('images') && $scope.entity.images.length) {
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
      });
    } else {
      $scope.uploaderForEdit.uploadAll();
    }

  }

  // init for profile page
  $scope.showProfile = function (entity) {
    Items.get({itemID:entity.id}, function (result) {
      $scope.entity = result;
      $scope.activeView = "views/item/itemProfile.html";
      $scope.trackListPage.activeView = '';
      if (result.hasOwnProperty('images') && result.images.length) {
        $scope.imgs = ($scope.entity.images).map(function (img) {
          return window.restful.baseImgSrcURL + img;
        });
      } else {
        $scope.imgs = [];
      }
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
    $scope.trackListPage.activeView = '';
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: window.restful.baseURL + '/upload?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename
    });
    uploader.bind('success', function(event, xhr, item, res) {
      var obj = {
        id: $window.item.id,
        images: {
          $push: res[0].filename
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
      $scope.entity.tags = $scope.merchantItemTags[0] || '';
    }, function (err) {
      console.log('err:\n', err);
    });
  }
  $scope.uploadInCreate = function () {
    var queue = $scope.uploader.queue;
    if (queue.length > 3) {
      alert('上传图片不能超过3张！');
      return;
    }
    for (var i = 0; i < queue.length; i++) {
      if ((queue[i].file.size/1000000)>2) {
        alert('图片大小必须小于2M');
        return;
      }
    }
    $scope.uploader.uploadAll();

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
      price: parseFloat($scope.entity.price*100),
      desc: $scope.entity.desc,
      model: $scope.entity.model,
      tags: [],
      images:[],
      imagesID:[],
      itemSkus: {
        fold: 0,
        totalQuantity: 0
      }
    };
    obj.tags.push($scope.entity.tags);
    Items.save(obj, function (result) {
      $scope.showList();
/*      $window.item = {};
      $window.item.id = result.id;
      $window.item.tags = result.tags;
      $scope.isShowUpload = true;
      $scope.isHideButton = true;
      $scope.info = true;
      $scope.alert = 'alert alert-success';
      $scope.msg = '商品信息创建成功，请上传商品照片，完成最后的创建';
      $timeout(function () {
        $scope.info = false;
      }, 2000);*/
    }, function (err) {
/*      $scope.info = true;
      $scope.alert = 'alert alert-danger';
      $scope.msg = '商品信息创建失败';
      $timeout(function () {
        $scope.info = false;
      }, 4000);*/
    });
  }
  $scope.paramsForDelete = 'removed';
  // some params for list page
  $scope.params['status'] = JSON.stringify({
    $ne: 'removed'
  });
  $scope.countQs['status'] = JSON.stringify({
    $ne: 'removed'
  });
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.params['withall'] = 'none';
  $scope.countQs['withall'] = 'none';
  $scope.defaultString = "name";
  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'modalAddTagInItem.html',
      controller: ModaCreateTagInItemCtrl,
      resolve: {
        itemTags: function () {
          return $scope.merchantItemTags;
        }
      }
    });
    modalInstance.result.then(function (newTag) {
      var obj = {
        "id": $scope.currentMerchant.merchant.id,
        "itemTags": {$push: newTag}
      };
      Merchants.update(JSON.stringify(obj), function (result) {
        $scope.merchantItemTags = result.itemTags;
        $scope.entity.tags = newTag;
      }, function (err) {
        console.log('err:\n', err);
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.delImgs = function () {
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
              $scope.showList();
            }
          });
        })
      }, function (err) {
        console.log('err:\n', err);
      });

  }
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
          Items.update(JSON.stringify(obj), function (result) {
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
  
  //Upload Import CSV
  $scope.openFileDialog = function () {
    $("#_uploadImportCsv").click()
  }
  $scope.uploadImportCsv = function (element) {
    $scope.$apply(function(scope) {
      var csvfile = element.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        var csvObjects = CSV.parse(reader.result)
        console.log(csvObjects, evt)
      };
      reader.readAsText(csvfile);
    });
  }
  
  widthFunctions();
}
var ModaCreateTagInItemCtrl = function ($scope, $modalInstance,itemTags) {
  $scope.tag = {
    name:''
  };
  $scope.ok = function () {
    var flag = true;
    itemTags.forEach(function (tag) {
      if (tag == $scope.tag.name) {
        flag = false;
        alert('创建失败，标签名重复');
        return;
      }
    });
    if (!$scope.tag.name) {
      alert('标签名不能为空');
    } else if(flag) {
      $modalInstance.close($scope.tag.name);
    }
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};