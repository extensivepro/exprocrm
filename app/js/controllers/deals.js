
/**
 * Created by expro on 14-1-10.
 * 销售管理
 */
function DealsController($scope, Deals, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Deals;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/deals/edit.html"

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
        {name: "serialNumber", title: "系列号", listHide:true, required:true},
        {name: "deviceCode", title: "设备编码",listHide:true, required:true},
        {name: "deviceID", title: "设备ID",listHide:true, required:true},
        {name: "billID", title: "交易ID",listHide:true, required:true},
        {name: "quantity", title: "数量", required:true},
        {name: "fee", title: "费用", required:true},
        {name: "memo", title: "memo",listHide:true, required:true},
        {name: "items", title: "商品", value:function(entity) {
            var itemNames = "";
            entity.items.forEach(function (item) {
                itemNames += item.item.name + " ";
            });
            return itemNames;
        }, required:true},
        {name: "seller", title: "卖家", value:function(entity) {
            return entity.seller.name;
        }, required:true},
        {name: "buyer", title: "买家",value:function(entity) {
            return entity.buyer.name;
        }, required:true},
        {name: "createdAt", title: "创建时间", required:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
}