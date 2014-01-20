/**
 * Created by expro on 14-1-10.
 * 库存管理
 */
function SkusController($scope, Skus, Items, Pagination, $timeout, $injector){

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
//        {name: "id", title: "id"},
        {name: "shopID", title: "商店ID", required:true, listHide:true},
        {name: "itemID", title: "商品编码", required:true, listHide:true},
        {name: "name", title: "商品", required:true},
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
    $scope.refreshList = function() {
        var p = $scope.pagination
        shopID = "2834910281d26a76";//暂时写死：商户为泛盈科技，商店名为总店
        var params = {page: p.iPage, limit: p.iLength, "shopID": shopID};
        if($scope.searchOptions.text !== '' && $scope.searchOptions.fields.length > 0) {
            params["$or"] = []
            $scope.searchOptions.fields.forEach(function(field){
                var filter = {}
                filter[field] = {$regex:$scope.searchOptions.text}
                params.$or.push(filter)

            })
            console.log(params)
        }
        $scope.resource.query(params, function(results){
            results.map(function(skus) {
                Items.query({"id":skus.itemID}, function(item) {
                    skus.name = item.name;//附上根据id查到的名字
                });
            });
            $scope.entities = results;
            $scope.pagination.paginate(results.length)
        })
    }
}