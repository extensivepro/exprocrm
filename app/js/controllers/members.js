

/**
 * Created by expro on 14-1-10.
 * 会员管理
 */
function MembersController($scope, Members, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Members;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/members/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id", listHide:true, hide:true },
        {name: "name", title: "姓名",required:true},
        {name: "code", title: "编码",required:true, hide:true },
        {name: "email", title: "邮箱",required:true},
        {name: "phone", title: "手机号",required:true },

        {name: "userID", title: "用户id", listHide:true , hide:true,isProfileHide:true },
        {name: "shop", title: "商店", listHide:true, hide:true,isProfileHide:true },
        {name: "merchant", title: "商户", listHide:true, value:function(entity) {
            return entity.merchant.name;
        }, hide:true,isProfileHide:true },
        {name: "postPoint", title: "当前积分", listHide:true, hide:true },
        {name: "postTotalPoint", title: "累计积分", listHide:true, hide:true },
        {name: "level", title: "等级", listHide:true, hide:true },
        {name: "status", title: "状态",required:true , value:function(entity){
            entity.fieldClass = entity.fieldClass || {}
            if(entity.status === 'active') {
                entity.fieldClass.status = "label label-success";
                return "正常"
            }  else {
                entity.fieldClass.status = "label label-warning";
                return "到期";
            }
        }, hide:true },
        {name: "sinceAt", title: "加入时间",required:true , listHide:true, hide:true ,isProfileHide:true},
        {name: "dueAt", title: "有效期至",required:true, listHide:true,isProfileHide:true},
        {name: "createdAt", title: "创建日期",required:true, hide:true ,isProfileHide:true},
        {name: "account", title: "账户金额",  value:function(entity) {
            return (entity.account.balance/100).toFixed(2);
        }, hide:true},
        {name: "registerShopID", title: "注册商店ID",required:true , listHide:true, hide:true,isProfileHide:true },
        {name: "updateAt", title: "更新日期", listHide:true, hide:true ,isProfileHide:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    };
    $scope.update = function(entity) {
        console.log('update=', entity);
        delete entity.merchant;
        delete entity.code;
        delete entity.shop;
        delete entity.createdAt;
        delete entity.userID;
        var resource = new $scope.resource(entity);
        console.log('update=' + JSON.stringify(resource));
        resource.$update(function(err) {
            $scope.showList()
        }, function(err) {
            console.log('update user error:', err)
        })
    };
    $scope.valueOfKeyString = function(entity, keyString) {
        var v = entity
        var keys = keyString.split('.')
        var theKey = keys[0]
        keys.forEach(function(key){
            theKey = key
            v = v[key]
        })
        if(theKey === 'sinceAt' || theKey === 'dueAt' || theKey === 'createdAt' || theKey === 'updateAt') {
            // var d = new Date(v*1000)
            // v = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
            v = new Date(v*1000).toLocaleString()
        }
        return v
    }
    $scope.create = function(entity) {
//        entity.name = "tst";
//        entity.code = "18012989801";
//        entity.email =  "1@qq.com";
//        entity.phone = "18951405261";
//        entity.status = "active";
//        entity.sinceAt = 1389150462;
//        entity.dueAt = 1420686462;
        entity.createdAt = Math.round(d.getTime()/1000);
//        entity.registerShopID = "2834910281d26a76";
        entity.merchant = {
            "merchantID": "ca138f08c3c1d8e1",
            "name": "泛盈科技",
            "fullName": "泛盈信息科技有限公司"
        };
        entity.account = {
            "balance": 5000,
            "createdAt": 1389149081239,
            "name": "郭芳",
            "ownerID": "ae43a4a589a619c3",
            "type": "member",
            "updateAt": 1389156617.253,
            "id": "6968827aed566840"
        };
        console.log("entity:" + JSON.stringify(entity));
        var newOne = new $scope.resource(entity)
        newOne.$save(function(user) {
            console.log("success",user)
            $scope.showList()
        },function(err){
            console.log('error:', err)
        })
    };

}