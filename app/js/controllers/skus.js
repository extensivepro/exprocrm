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
        {name: "itemID", title: "商品编码", required:true, listHide:true},
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

  $scope.refreshList = function () {
    var p = $scope.pagination
    var params = {}
    if ($scope.searchOptions.text !== '' && $scope.searchOptions.fields.length > 0) {
      var filters = []
      $scope.searchOptions.fields.forEach(function (field) {
        var filter = {}
        filter[field] = {$regex: $scope.searchOptions.text}
        filters.push(filter)
      })
      params.$or = JSON.stringify(filters)
      $scope.$emit('LOAD')
      $scope.resource.query(params, function (results) {
        $scope.pagination.paginate(results.length)
        $scope.totalSearch = results.length
        $scope.$emit('UNLOAD')
        console.log($scope.totalSearch);

        params.$skip = (p.iPage - 1) * p.iLength
        params.$limit = p.iLength

        if (params.$skip == -10 || $scope.totalSearch == 0){
          $scope.$emit('NOSEARCHBACK')
          params.$skip = 0
          p.iStart = 1
          p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
          })
        }
        else {
          $scope.$emit('SEARCHBACK')
          $scope.resource.query(params, function (results) {
            $scope.entities = results;
          })
        }
        if (! $scope.totalSearch == 0)
          $scope.$emit('SEARCHBACK')
      })
    } else {
      $scope.$emit('LOAD')
      $scope.$emit('SEARCHBACK')
      if ($scope.total == 0) {
        $scope.$emit('LOAD')
        $scope.resource.count(function (result){
          $scope.total = result.count
          $scope.pagination.paginate(result.count)
        });
      } else {
        $scope.pagination.paginate($scope.total)
      }
      params = {$skip: (p.iPage - 1) * p.iLength, $limit: p.iLength, shopID:'2834910281d26a76'};
      if (params.$skip == -10){
        params.$skip = 0
        p.iStart = 1
        p.iEnd = p.iTotal > p.iLength? p.iLength: p.iTotal
        $scope.resource.query(params, function (results) {
          $scope.entities = results;
          $scope.$emit('UNLOAD')
        })
      } else {
        $scope.resource.query(params, function (results) {
          $scope.entities = results;
          $scope.$emit('UNLOAD')
        })
      }
    }
  }
}