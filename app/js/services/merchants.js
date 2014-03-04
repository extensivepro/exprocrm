'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Merchants", function($resource){
  return $resource(window.restful.baseURL+'/merchants/:merchantID', {merchantID:'@id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {merchantID: 'count'}}
  });
});