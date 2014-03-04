'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Employes", function($resource){
  return $resource(window.restful.baseURL+'/employes/:employeID', {employeID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {employeID: 'count'}}
  });
});