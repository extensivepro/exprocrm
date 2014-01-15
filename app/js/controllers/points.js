
/**
 * Created by expro on 14-1-10.
 * 积分管理
 */
function PointsController($scope, Points, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Points;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/points/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id", listHide:true},
        {name: "point", title: "积分数",required:true},
        {name: "memberID", title: "会员ID",required:true },
        {name: "merchantID", title: "商户ID",required:true},
        {name: "createdAt", title: "创建时间",required:true },

        {name: "postPoint", title: "累积积分",required:true},
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


}