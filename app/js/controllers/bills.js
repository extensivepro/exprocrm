
/**
 * Created by expro on 14-1-10.
 * 储值管理
 */
function BillsController($scope, Bills, Employes, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Bills;
    $scope.searchOptions.fields = ['username']
    $scope.editView = "views/bills/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"
    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "createdAt", title: "日期"},
        {name: "billNumber", title: "账单号", listHide:true},
        {name: "deviceID", title: "deviceID", listHide:true},
        {name: "dealID", title: "dealID",  listHide:true},
        {name: "amount", title: "数量", listHide:true},
        {name: "discountAmount", title: "折扣数", listHide:true},

        {name: "dealType", title: "交易类型",value:function(entity) {
            var type = entity.dealType;
            console.log("type:" + type);
            if (type == 'deal') {
                return '交易';
            } else if (type == 'prepay') {
                return  '充值';
            } else {
                return '退款';
            }
        }},

        {name: "cashSettlement", title: "金额", value:function(entity) {
            if (!entity.hasOwnProperty('cashSettlement')) {
                return "";
            } else if (!entity.cashSettlement.hasOwnProperty('amount'))  {
                return "";
            } else {
                return (entity.cashSettlement.amount/100).toFixed(2);
            }
        }},
        {name: "memberSettlement", title: "顾客", value:function(entity) {
            if (!entity.hasOwnProperty('memberSettlement')) {
                return "";
            } else if (!entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
                return "";
            } else {
                return entity.memberSettlement.payeeAccount.name;
            }
        }},
        {name: "memo", title: "memo",listHide:true},
        {name: "agentID", title: "经手人"},
        {name: "shopID", title: "shopID",listHide:true}


    ];

    // bussiness
    $scope.setStatus = function(status) {
        $scope.entity.status = status
        $scope.update(true)
    }
    $scope.hideRow = function(entity) {
        if (!entity.hasOwnProperty('memberSettlement')) {
            return true;
        } else if (!entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
            return true;
        } else {
            return false;
        }
    }
    $scope.refreshList = function() {
        var p = $scope.pagination
        params = {
          $skip: (p.iPage-1)* p.iLength, 
          $limit:p.iLength
        }
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
          $scope.entities = results
            // $scope.entities = results.filter(function(entity) {
            //     if (!entity.hasOwnProperty('memberSettlement')) {
            //         return false;
            //     } else if (!entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
            //         return false;
            //     } else {
            //         return true;
            //     }
            // });
            // $scope.entities.map(function(emp) {
            //     Employes.queryForBills({"id":emp.agentID}, function(employee) {
            //         emp.agentID = employee.name;
            //     });
            // });
            // $scope.pagination.paginate($scope.entities.length);
        })
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