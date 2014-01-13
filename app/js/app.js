'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('exproCRM', [
  'ngCookies',
  'ngRoute',
  'exproCRM.filters',
  'exproCRM.services',
  'exproCRM.directives',
  'exproCRM.controllers'
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
	baseURL: "http://localhost:2403"
//	baseURL: "http://service.fankahui.com:2403"
};
