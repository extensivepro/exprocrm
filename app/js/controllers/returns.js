/**
 * 交易记录
 * Created by expro on 14-1-13.
 */


/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function ReturnsController($scope, Returns, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Returns;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/returns/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
        {name: "id", title: "id"},
        {name: "shopID", title: "billNumber"},
        {name: "dealID", title: "deviceID"},
        {name: "billID", title: "dealID"},
        {name: "dealSerialNumber", title: "dealType"},
        {name: "serialNumber", title: "amount"},
        {name: "deviceID", title: "discountAmount"},
        {name: "quantity", title: "cashSettlement"},
        {name: "fee", title: "memberSettlement"},
        {name: "memo", title: "memo"},
        {name: "items", title: "创建日期"},
        {name: "agent", title: "agentID"},
        {name: "customer", title: "shopID"},
        {name: "createAt", title: "shopID"}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}