
/**
 * Created by expro on 14-1-10.
 * 销售管理
 */
function DealsController($scope, Deals, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Deals;
    $scope.searchOptions.fields = ['buyer.name', 'seller.name']
    $scope.searchOptions.tooltip = "搜索顾客，销售员姓名"
    $scope.editView = "views/deals/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID", listHide:true},
        {name: "serialNumber", title: "流水号",  required:true},
        {name: "deviceCode", title: "设备编码",listHide:true, required:true},
        {name: "deviceID", title: "设备ID",listHide:true, required:true},
        {name: "billID", title: "交易ID",listHide:true, required:true},
        {name: "quantity", title: "数量", required:true},
        {name: "fee", title: "成交金额", required:true,value:function(entity) {
            return (entity.fee/100).toFixed(2);
        } },
        {name: "memo", title: "memo",listHide:true, required:true},
        {name: "items", title: "商品", value:function(entity) {
            var itemNames = "";
            entity.items.forEach(function (item) {
                itemNames += item.item.name + " ";
            });
            return itemNames;
        }, required:true, listHide:true},
        {name: "buyer", title: "顾客",value:function(entity) {
            return entity.buyer.name;
        }, required:true},
        {name: "seller", title: "销售员", value:function(entity) {
            return entity.seller.name;
        }, required:true},
        {name: "createdAt", title: "成交时间", required:true}
    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
    $scope.fieldOperations = [
        {class: "btn btn-success", icon: "fa fa-file", op: "showProfile"}
        ,	{class: "btn btn-danger", icon: "fa fa-trash-o", op:"remove"}
    ]

    // profile
    $scope.profileShortcuts = [
        {class: "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-trash-o", text: "删除", op:"remove"}
    ];
    $scope.isHide = true; //隐藏新增按钮
    $scope.params['shopID'] = $scope.currentMerchant.shopIDs[0];
    $scope.countQs['shopID'] = $scope.currentMerchant.shopIDs[0];
}