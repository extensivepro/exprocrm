/**
 * 交易记录
 * Created by expro on 14-1-13.
 */


/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function AccountsController($scope, Accounts, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Accounts;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/accounts/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
        {name: "id", title: "id"},
        {name: "ownerID", title: "ownerID"},
        {name: "type", title: "类型"},
        {name: "name", title: "姓名"},
        {name: "balance", title: "余额"},

        {name: "createdAt", title: "创建日期"},
        {name: "updateAt", title: "更新日期"}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}