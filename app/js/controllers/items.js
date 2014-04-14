function ItemsController($scope, Items, Pagination, $timeout, $injector, $window, $fileUploader){
  $injector.invoke(BasicController, this, {$scope: $scope});
  $scope.resource = Items
  $scope.searchOptions.fields = ['name']
  $scope.searchOptions.tooltip = "请输入商品名称"
  $scope.editView = "views/item/edit.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "merchantID", title: "业主ID", required: true, listHide: true, hide: true, isProfileHide:true, createHide: true},
    {name: "code", title: "商品编码", required: true, hide: true, createHide:true},
    {name: "name", title: "商品名", required: true},

    {name: "model", title: "型号", createHide:true},
    {name: "mnemonicCode", title: "助记码", listHide: true, createHide:true},
    {name: "price", title: "售价", required: true, value:function(entity) {
    entity.fieldClass = entity.fieldClass || {}
    return (entity.price/100).toFixed(2)}},
    {name: "desc", title: "商品描述", listHide: true},
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
    {name: "updatedAt", title: "更新日期", createHide: true, listHide: true, hide: true, isProfileHide:true}
  ];

  $scope.showCreate = function () {
    $scope.activeView = "views/item/create.html"
  }
  $scope.create = function (entity) {
    entity.createdAt = Math.round(new Date().getTime() / 1000);
    entity.merchantID = $scope.currentMerchant.merchant.id;
    console.log('entity:\n', entity);
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
      images:[]
    };
    obj.tags.push($scope.entity.tags);
    console.log('obj:\n', obj);
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
  var subdir = 'images';
  var comments = '';
  var uniqueFilename = false;
  var uploader = $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: window.restful.baseURL + '/upload?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename
  });
  uploader.bind('success', function(event, xhr, item, res) {
    var obj = {
      id: $window.item.id,
      images: {
        $push: item.file.name
      }
    }
    Items.update(JSON.stringify(obj), function (result) {
    }, function (err) {
      console.log('err:\n', err);
    })
  });
  uploader.bind('completeall', function(event, items) {
    $scope.showList()
  });
  $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
  $scope.defaultString = "name";
  widthFunctions();
}
