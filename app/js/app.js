'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('exproRMS', [
  'ngCookies',
  'ngRoute',
  'ui.utils',
  'ui.bootstrap',
  'ngBootstrap',
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
  $routeProvider.when('/main', {templateUrl: 'views/main.html'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
}]);

//Setting up Restful Server
window.restful = {
	baseURL: "http://service.fankahui.com:2403",
  baseImgSrcURL: "http://service.fankahui.com:2403/uploadImg/images/"
};
