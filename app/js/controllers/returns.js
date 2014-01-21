
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
        {name: "shopID", title: "商店ID", listHide:true},
        {name: "dealID", title: "交易ID", listHide:true},
        {name: "billID", title: "账单ID", listHide:true},
        {name: "memo", title: "memo", listHide:true},
        {name: "items", title: "items", listHide:true},
        {name: "deviceID", title: "deviceID", listHide:true},
        {name: "dealSerialNumber", title: "退单号"},
        {name: "serialNumber", title: "交易流水号"},
        {name: "createdAt", title: "退货时间"},
        {name: "quantity", title: "数量"},
        {name: "fee", title: "退款",value:function(entity) {
            return (entity.fee/100).toFixed(2);
        }},
        {name: "customer", title: "顾客",value:function(entity) {
            if (entity.hasOwnProperty("customer")) {
                return entity.customer.name;
            } else {
                return "走入顾客";
            }
        }},
        {name: "agent", title: "经手人", value:function(entity) {
            return entity.agent.name;
        }}



    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}