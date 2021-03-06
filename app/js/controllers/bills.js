
/**
 * Created by expro on 14-1-10.
 * 储值管理
 */
function BillsController($scope, Bills, Employes, Pagination, $timeout, $injector){

    $injector.invoke(BasicController, this, {$scope: $scope});
    $scope.resource = Bills;
    $scope.searchOptions.fields = ['agentName', 'memberSettlement.payerAccount.name']
    $scope.searchOptions.tooltip = "请输入经手人姓名或顾客姓名"
    $scope.editView = "views/bills/edit.html"
    $scope.profileAvatar = "img/avatar.jpg"
    // profile
    $scope.profileFields = [
//        {name: "id", title: "id"},
        {name: "billNumber", title: "账单号"},
        {name: "deviceID", title: "deviceID", listHide:true, isProfileHide:true},
        {name: "dealID", title: "dealID",  listHide:true, isProfileHide:true},
        {name: "discountAmount", title: "折扣数", listHide:true, isProfileHide:true, value: function (entity) {
          return (entity.discountAmount/100).toFixed(2);
        }},/*
        {name: "memberSettlement", title: "顾客", value:function(entity) {
            if (!entity.hasOwnProperty('memberSettlement')) {
                return "";
            } else if (entity.memberSettlement.hasOwnProperty('payeeAccount'))  {
                return entity.memberSettlement.payeeAccount.name;
            } else if (entity.memberSettlement.hasOwnProperty('payerAccount')){
                return entity.memberSettlement.payerAccount.name;
            } else {
                return "";
            }
        }},*/
        {name: "amount", title: "金额", value:function(entity) {
            return (entity.amount/100).toFixed(2);
        }},
        {name: "agentName", title: "经手人"},
        {name: "dealType", title: "交易类型",value:function(entity) {
            var type = entity.dealType;
            entity.fieldClass = entity.fieldClass || {}
            if (type == 'deal') {
                entity.fieldClass.dealType = "label label-success";
                return '付款';
            } else if (type == 'prepay') {
                entity.fieldClass.dealType = "label label-info";
                return  '充值';
            } else if (type == 'return') {
                entity.fieldClass.dealType = "label label-warning";
                return '退款';
            } else if (type == 'writedown') {
              entity.fieldClass.dealType = "label label-danger";
              return '冲减';
            }
        }},
        {name: "createdAt", title: "日期"},
        {name: "memo", title: "memo",listHide:true, isProfileHide:true},
        {name: "shopID", title: "shopID",listHide:true, isProfileHide:true}


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

    $scope.fieldOperations = [
        {"class": "btn btn-success", icon: "fa fa-file", op: "showProfile"}
        ,	{"class": "btn btn-danger", icon: "fa fa-trash-o", op:"remove"}
    ]

    // profile
    $scope.profileShortcuts = [
        {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-trash-o", text: "删除", op:"remove"}
    ];
    $scope.isHide = true; //隐藏新增按钮
    $scope.params['merchantID'] = $scope.currentMerchant.merchant.id;
    $scope.countQs['merchantID'] = $scope.currentMerchant.merchant.id;
    $scope.defaultString = "memberSettlement.payerAccount.name";
}