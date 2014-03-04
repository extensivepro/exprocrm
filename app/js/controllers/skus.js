/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Skus
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/skus/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"

    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID", required:true, listHide:true},
        {name: "itemID", title: "商品编码", required:true},
        {name: "itemName", title: "商品", required:true},
        {name: "quantity", title: "数量", required:true},
        {name: "sumPrice", title: "支出", required:true,value:function(entity) {
            return (entity.sumPrice/100).toFixed(2);
        }},
        {name: "createdAt", title: "日期", required:true},
        {name: "operator", title: "经手人", required:true, value:function(entity) {
            return entity.operator.name;
        }},
        {name: "status", title: "状态", required:true, listHide:true},
        {name: "merchantID", title: "商户ID", required:true, listHide:true},
        {name: "updateAt", title: "更新日期", listHide:true, required:true}

    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    };
    $scope.create = function(entity) {
        entity.operator = {"employeeID":"101"};
        entity.createdAt = Math.round(new Date().getTime()/1000);
        var newOne = new $scope.resource(entity)
        newOne.$save(function(user) {
            console.log("success",user)
            $scope.showList()
        },function(err){
            console.log('error:', err)
        })
    }

    $scope.params['shopID'] = $scope.currentMerchant.shopIDs[0]; // default use the first shop of the currentMerchant
}