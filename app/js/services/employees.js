'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Employes", function($resource){
  return $resource(window.restful.baseURL+'/employes/:employeID', {employeID:'@_id'}, {
    me: {method: 'GET', params:{employeID:'me'}},
    update: { method: 'PUT' }
  });
});