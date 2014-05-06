function MerchantsController($scope, Merchants, Pagination, $timeout, $injector,localStorageService, $fileUploader,$resource){
  //start: basic
  $scope.activeView = "views/merchant/profile.html"
  $scope.profileAvatar = "img/avatar.jpg"
  $scope.profileFields = [
    {name: "id", title: "商户ID", unlist: true, hide:true, createHide: true, isProfileHide:true}
    , {name: "owner", title: "商户业主", value:function(entity) {
      return entity.owner.displayName
    }, hide: true, createHide: true, unlist: true}
    , {name: "name", title: "商户简称", required: true, hide: true}
    , {name: "fullName", title: "商户全名", required: true, unlist: true, hide: true}
    , {name: "telephone", title: "电话", required: true}
    , {name: "email", title: "电子邮箱", unlist: true}
    , {name: "address", title: "地址", required: true}
    , {name: "zip", title: "邮编", unlist: true}
    , {name: "url", title: "商户网站", unlist: true}
    , {name: "weixinOriginID", title: "微信公众号原始ID", unlist: true, value: function (entity) {
      if (entity.hasOwnProperty('weixin')) {
        return entity.weixin.originID;
      } else {
        return '';
      }
    }}
    , {name: "weixinAppid", title: "微信公众号应用ID", unlist: true, value: function (entity) {
      if (entity.weixin && entity.weixin.devToken && entity.weixin.devToken.appid) {
        return entity.weixin.devToken.appid;
      } else {
        return '';
      }
    }}
    , {name: "weixinSecret", title: "微信公众号秘钥", unlist: true, value: function (entity) {
      if (entity.weixin && entity.weixin.devToken && entity.weixin.devToken.appid) {
        return entity.weixin.devToken.secret;
      } else {
        return '';
      }
    }}
    , {name: "createdAt", title: "创建日期", hide: true, createHide: true}
    , {name: "updateAt", title: "更新日期", unlist: true, hide: true, createHide: true, isProfileHide:true}
    , {name: "newestDeviceCode", title: "设备编码", hide: true, unlist: true, isProfileHide:true, createHide: true}
    ,	{name: "status", title: "状态", value:function(entity){
      entity.fieldClass = entity.fieldClass || {}
      if(entity.status === 'open') {
        entity.fieldClass.status = "label label-success"
        return "营业"
      } else if(entity.status === 'closed') {
        entity.fieldClass.status = "label label-warning"
        return "停业"
      } else {
        return "状态错误"
      }
    }, hide:true, createHide: true}
  ];
  $scope.profileShortcuts = [
      {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-edit fa-5x", text: "编辑", op:"edit"}
  ];
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
  };
  $scope.cancel = function () {
    $scope.activeView = "views/merchant/profile.html"
  };
  //end: basic


  //start: profile
  $scope.showProfile = function () {
    $scope.activeView = "views/merchant/profile.html";
  };
  $scope.$watch('currentMerchant.merchant.logo', function () {
    var logo = $scope.currentMerchant.merchant.logo;
    if (logo) {
      $scope.logoImg = window.restful.baseLogoSrcURL + logo.name;
    }
  });
  //end: profile


  //start: create
  $scope.showCreate = function() {
    $scope.entity = {};
    $scope.activeView = "views/merchant/create.html"
  }
  $scope.create = function(entity) {
    if (!$scope.check('create')) {
      return;
    }
    entity["owner"] = $scope.me;
    entity['createdAt'] = Math.round(new Date().getTime() / 1000);
    var newOne = new Merchants(entity);
    newOne.$save(function(user) {
      Merchants.get({id:newOne.id}, function(merchant) {
        $scope.currentMerchant.merchant = merchant;
        $scope.allMerchant.push(merchant);
        $scope.activeView = "views/merchant/profile.html"
      })
    },function(err){
      showDpdAlert(err);
    });
  }
  //end: create


  //start: edit
  $scope.showEdit = function (entity) {
    $scope.entity = entity
    $scope.activeView = "views/merchant/edit.html"
  }
  $scope.edit = function (entity) {
    if (!$scope.check('edit')) {
      return;
    }
    Merchants.update(entity, function (result) {
      Merchants.get({id:result.id}, function (merchant) {
        var allMerchants = $scope.allMerchant;
        for (var i = 0; i < allMerchants.length; i++) {
          if (allMerchants[i].id == merchant.id) {
            $scope.allMerchant[i] = merchant;
            break;
          }
        }
        $scope.currentMerchant.merchant = merchant;
        $scope.activeView = "views/merchant/profile.html";
      }, function (err) {
        console.log('err:\n', err);
      })
    }, function (err) {
      showDpdAlert(err);
    });
  }
  $scope.initUpload = function () {
    var subdir = 'logos';
    var comments = '';
    var uniqueFilename = true;
    uploader = $scope.uploader = {};
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: window.restful.baseURL + '/upload?subdir=' + subdir + '&comments=' + comments + '&uniqueFilename=' + uniqueFilename
    });
    uploader.bind('success', function(event, xhr, item, res) {
      var obj = {
        id: $scope.currentMerchant.merchant.id,
        logo: {
          name: res[0].filename,
          id:res[0].id
        }
      };
      $scope.currentMerchant.merchant.logo = obj.logo;
      Merchants.update(obj, function (result) {
      }, function (err) {
        console.log('err:\n', err);
      })
    });
    uploader.bind('completeall', function(event, items) {
      $scope.showProfile();
    });
  }
  $scope.uploadInEdit = function () {
    if ($scope.uploader.queue.length > 1) {
      alert('上传图片不能超过1张！');
      $scope.uploader.clearQueue();
    } else if(($scope.uploader.queue[0].file.size/1000000)>2){
      alert('照片大小不能大于2M');
      $scope.uploader.clearQueue();
    }else{
      var currMerchant = $scope.currentMerchant.merchant;
      if (!currMerchant.hasOwnProperty('logo')) {  // 从未上传过logo
        $scope.uploader.uploadAll();
      } else if (!currMerchant.logo.hasOwnProperty('name')){ // 上传过，但是因为一些原因图片丢失了
        $scope.uploader.uploadAll();
      } else { //正常情况下修改上传图片
        var Upload = $resource(window.restful.baseURL+'/upload/:id', {id:'@id'});
        Upload.delete({id: $scope.currentMerchant.merchant.logo.id}, function () {
          $scope.uploader.uploadAll();
        }, function (err) { // 删除原有图片报错，可能是图片在服务端被人手动删除了
          alert('您的logo图片因为一些意外而丢失，请刷新页面后重新上传');
          var obj = {
            id: $scope.currentMerchant.merchant.id,
            logo: {}
          };
          Merchants.update(obj, function (result) {
            console.log('result:\n', result);
          }, function (err) {
            console.log('err:\n', err);
          });
        });
      }
    }
  }
  //end: edit


  //start: localstorage
  $scope.storageType = 'Local storage';
  if (localStorageService.getStorageType().indexOf('session') >= 0) {
    $scope.storageType = 'Session storage'
  }
  if (!localStorageService.isSupported) {
    $scope.storageType = 'Cookie';
  }
  $scope.local = {};
  $scope.$watch('local.cbx', function () {
    if ($scope.local.cbx===true) {
      localStorageService.set('localStorageCurrentMerchant',$scope.currentMerchant.merchant);
    }
  });
  //end: localstorage


  //start: msg
  $scope.initErrContent = function () { // 进入新增和编辑界面首先要将errContent置空
    $scope.errContent = { // errContent：用于展示错误消息的对象
      msg:''
    };
  }
  $scope.check = function (flag) { // 校验新增和编辑时的属性值
    var v = $scope.entity;
    var m = $scope.errContent;
    if (!v.name) {
      m.msg = '商户简称不能为空';
      return showAlert();
    } else if (!v.fullName) {
      m.msg = '商户全称不能为空';
      return showAlert();
    } else if (!(/^\d{7,11}$/.test(v.telephone))) {
      m.msg = '号码格式不对，需为7~11数字';
      return showAlert();
    } else if (flag == 'create'){
      return true;
    } else if (v.hasOwnProperty('email') && v.email && !($scope.patternForEmail.test(v.email))) {
      m.msg = '邮箱格式不正确';
      return showAlert();
    } else if (v.hasOwnProperty('zip') && v.zip && !(/^\d{6}/.test(v.zip))) {
      m.msg = '邮编不对，需为6位数字';
      return showAlert();
    } else {
      return true;
    }
  };
  function showDpdAlert(err) { // 来自服务端的错误信息
    if (err.data) {
      if (err.data.message == 'merchant name exist') {
        $scope.errContent.msg = '此商户简称已被占用！';
        showAlert();
      } else if (err.data.message == 'merchant fullName exist') {
        $scope.errContent.msg = '此商户全名已被占用！';
        showAlert();
      } else if (err.data.message == 'exist originID of weixin') {
        $scope.errContent.msg = '此微信公众号已被占用！';
        showAlert();
      }
    } else {
      console.log('err:\n', err);
    }
  }
  function showAlert() { // 2秒后错误消息消失，并放回false
    $timeout(function () {
      $scope.errContent.msg = '';
    }, 2000);
    return false;
  }
  //end: msg


  widthFunctions();
}