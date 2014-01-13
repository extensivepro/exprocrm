/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Skus
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/skus/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID"},
        {name: "itemID", title: "商品ID"},
        {name: "name", title: "商品名"},
        {name: "quantity", title: "数量"},
        {name: "operator", title: "操作员"},
        {name: "createdAt", title: "创建日期"},
        {name: "status", title: "状态"},
        {name: "sumPrice", title: "总价"},
        {name: "updateAt", title: "更新日期"},

    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}