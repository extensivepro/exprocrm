'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Shops", function($resource){
  return $resource(window.restful.baseURL+'/shops/:shopID', {shopID:'@_id'}, {
    me: {method: 'GET', params:{shopID:'me'}},
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {shopID: 'count'}}
  });
});