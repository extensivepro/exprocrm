
/**
 * Created by expro on 14-1-10.
 * 储值管理
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
//        {name: "id", title: "id"},
        {name: "billNumber", title: "账单号"},
        {name: "deviceID", title: "deviceID", listHide:true},
        {name: "dealID", title: "设备ID"},
        {name: "dealType", title: "交易类型"},
        {name: "amount", title: "数量"},
        {name: "discountAmount", title: "折扣数"},
        {name: "cashSettlement", title: "cashSettlement",listHide:true},
        {name: "memberSettlement", title: "memberSettlement",listHide:true},
        {name: "memo", title: "memo",listHide:true},
        {name: "createdAt", title: "创建日期"},
        {name: "agentID", title: "agentID",listHide:true},
        {name: "shopID", title: "shopID",listHide:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}