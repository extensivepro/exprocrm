'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('exproCRM', [
  'ngCookies',
  'ngRoute',
  'ui.utils',
  'ui.bootstrap',
  'ngBootstrap',
  'googlechart',
  'exproCRM.filters',
  'exproCRM.services',
  'exproCRM.directives'
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
	baseURL: "http://192.168.0.116:2403"
};
