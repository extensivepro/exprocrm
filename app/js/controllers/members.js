/**
 * 交易记录
 * Created by expro on 14-1-13.
 */


/**
 * Created by expro on 14-1-10.
 * 库存管理
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
        {name: "id", title: "id"},
        {name: "name", title: "姓名"},
        {name: "code", title: "code"},
        {name: "email", title: "邮箱"},
        {name: "phone", title: "手机号"},

/*        {name: "userID", title: "userID"},
        {name: "shop", title: "商店"},
        {name: "merchant", title: "商户"},
        {name: "postPoint", title: "postPoint"},
        {name: "postTotalPoint", title: "postTotalPoint"},
        {name: "level", title: "等级"},
        {name: "status", title: "状态"},
        {name: "sinceAt", title: "sinceAt"},
        {name: "dueAt", title: "dueAt"},
        {name: "createdAt", title: "创建日期"},
        {name: "account", title: "账户"},
        {name: "registerShopID", title: "注册商店ID"},
        {name: "updateAt", title: "更新日期"}*/


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}