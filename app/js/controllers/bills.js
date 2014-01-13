/**
 * 交易记录
 * Created by expro on 14-1-13.
 */


/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function BillsController($scope, Bills, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Bills;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/bills/edit.html"

    // profile
    $scope.profileShortcuts = $scope.profileShortcuts.concat([
        {class: "span9"}
        ,	{class: "box quick-button-small span1", icon: "icon-certificate", text: "重置密码", op:"resetPassword(entity)"}
    ])
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
        {name: "id", title: "id"},
        {name: "billNumber", title: "billNumber"},
        {name: "deviceID", title: "deviceID"},
        {name: "dealID", title: "dealID"},
        {name: "dealType", title: "dealType"},
        {name: "amount", title: "amount"},
        {name: "discountAmount", title: "discountAmount"},
        {name: "cashSettlement", title: "cashSettlement"},
        {name: "memberSettlement", title: "memberSettlement"},
        {name: "memo", title: "memo"},
        {name: "createdAt", title: "创建日期"},
        {name: "agentID", title: "agentID"},
        {name: "shopID", title: "shopID"}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}