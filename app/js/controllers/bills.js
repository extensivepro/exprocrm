
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
        {name: "billNumber", title: "账单号", listHide:true},
        {name: "deviceID", title: "deviceID", listHide:true},
        {name: "dealID", title: "dealID",  listHide:true},
        {name: "amount", title: "数量", listHide:true},
        {name: "discountAmount", title: "折扣数", listHide:true},

        {name: "dealType", title: "交易类型",value:function(entity) {
            var type = entity.dealType;
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
                return entity.cashSettlement.amount;
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
        {name: "createdAt", title: "日期",listHide:true},
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
        var params = {page:p.iPage, limit:p.iLength}
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
            $scope.entities = results.filter(function(entity) {
                if (!entity.hasOwnProperty('memberSettlement')) {
                    return false;
                } else if (!entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
                    return false;
                } else {
                    return true;
                }
            });
            $scope.pagination.paginate($scope.entities.length);
        })
    }
}