
/**
 * Created by expro on 14-1-10.
 * 销售管理
 */
function DealsController($scope, Deals, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Deals;
    $scope.searchOptions.fields = ['username']
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
        {name: "seller", title: "销售员", value:function(entity) {
            return entity.seller.name;
        }, required:true},
        {name: "buyer", title: "顾客",value:function(entity) {
            return entity.buyer.name;
        }, required:true},
        {name: "createdAt", title: "成交时间", required:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
    $scope.fieldOperations = [
        {class: "btn btn-success", icon: "icon-file", op: "showProfile"}
        ,	{class: "btn btn-danger", icon: "icon-trash", op:"remove"}
    ]

    // profile
    $scope.profileShortcuts = [
        {class: "box quick-button-small span1", icon: "icon-trash", text: "删除", op:"remove"}
    ];
    $scope.isHide = true; //隐藏新增按钮
}