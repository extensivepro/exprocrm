'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('exproRMS', [
  'ngCookies',
  'ngRoute',
  'ui.utils',
  'ui.bootstrap',
  'ngBootstrap',
  'ngCsv',
  'googlechart',
  'exproRMS.filters',
  'exproRMS.services',
  'exproRMS.directives',
  'ngAnimate',
  'angularFileUpload',
  'LocalStorageModule'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: 'SignController'});
  $routeProvider.when('/register', {templateUrl: 'views/user/register.html', controller: 'RegisterController'});
  $routeProvider.when('/main', {templateUrl: 'views/main.html'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
}]);

//Setting up Restful Server
window.restful = {
	baseURL: "http://service.fankahui.com:2403",
  baseImgSrcURL: "http://service.fankahui.com:2403/uploadImg/images/",
  baseLogoSrcURL: "http://service.fankahui.com:2403/uploadImg/logos/"
};
app.filter('changeName', function () {
  return function (key) {
    switch (key) {
      case 'newMember': return '新会员积分';
      case 'referrer': return '推荐积分';
      case 'consumption': return '消费积分比例';
    }
  }
});
