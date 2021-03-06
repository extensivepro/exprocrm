
/**
 * Created by expro on 14-1-10.
 * 积分管理
 */
function PointsController($scope, Points, Pagination, $timeout, $injector, Merchants){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Points;
    $scope.searchOptions.fields = ['member.name']
    $scope.searchOptions.tooltip = "请输入会员名称"
    $scope.editView = "views/points/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id", listHide:true},
        {name: "createdAt", title: "创建时间",required:true },
        {name: "memberID", title: "会员名",required:true, value: function (entity) {
          return entity.member.name;
        }},
        {name: "point", title: "积分数",required:true},
        {name: "merchantID", title: "商户名",required:true, value: function (entity) {
          return entity.merchantName;
        }},
        {name: "postPoint", title: "当前积分",required:true},
        {name: "postTotalPoint", title: "累计积分",required:true},
        {name: "agentID", title: "agentID", listHide:true,required:true},
        {name: "shopID", title: "商店ID", listHide:true,required:true},
        {name: "reason", title: "原因", listHide:true,required:true}

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

    $scope.fieldOperations = [
        {class: "btn btn-success", icon: "fa fa-file", op: "showProfile"}
        ,	{class: "btn btn-danger", icon: "fa fa-trash-o", op:"remove"}
    ]

    // profile
    $scope.profileShortcuts = [
        {class: "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-trash-o", text: "删除", op:"remove"}
    ];
    $scope.isHide = true; //隐藏新增按钮
    $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
    $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
    $scope.defaultString = "memberID";
}