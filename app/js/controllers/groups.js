/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-26
 */
function GroupsController($scope, Pagination, $timeout, $injector){
  $injector.invoke(BasicController, this, {$scope: $scope});
//  $scope.resource = Groups;
  $scope.searchOptions.fields = ['']
  $scope.searchOptions.tooltip = ""
  $scope.profileFields = [
    {name: "name", title: "活动名称"},
    {name: "items", title: "活动商品"},
    {name: "numbers", title: "子团人数"},
    {name: "status", title: "活动状态"},
    {name: "startTime", title: "开始时间"},
    {name: "endTime", title: "截止时间"},
  ];

  // profile
  $scope.profileShortcuts = [
    {"class": "box quick-button-small col-lg-1 col-md-2 col-xs-6", icon: "fa fa-print", text: "打印", op:"print"}
  ];

  $scope.showProfile = function (entity) {
    $scope.entity = entity || $scope.entity
    $scope.activeView = "views/orders/profile.html";
    $scope.trackListPage.activeView = '';
  };
  $scope.isGroup = true;
  $scope.statusForGroup = [
    {
      key:'',
      value: '全部'
    },
    {
      key:'start',
      value:'进行中'
    },
    {
      key:'end',
      value:'已结束'
    }
  ];
  $scope.currentStatus = {};
  $scope.currentStatus.status = $scope.statusForGroup[0];
  $scope.showCreate = function () {
    $scope.activeView = "views/groups/create.html";
    $scope.trackListPage.activeView = '';

  }
}