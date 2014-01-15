
/**
 * Created by expro on 14-1-10.
 * 退货管理
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
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID"},
        {name: "dealID", title: "交易ID"},
        {name: "billID", title: "账单ID"},
        {name: "dealSerialNumber", title: "dealSerialNumber", listHide:true},
        {name: "serialNumber", title: "serialNumber", listHide:true},
        {name: "deviceID", title: "deviceID", listHide:true},
        {name: "quantity", title: "数量"},
        {name: "fee", title: "费用"},
        {name: "memo", title: "memo", listHide:true},
        {name: "items", title: "items", listHide:true},
        {name: "agent", title: "agent", listHide:true},
        {name: "customer", title: "customer", listHide:true},
        {name: "createAt", title: "createAt", listHide:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}