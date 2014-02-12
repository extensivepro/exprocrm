'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Items", function($resource){
  return $resource(window.restful.baseURL+'/items/:itemID', {itemID:'@_id'}, {
    me: {method: 'GET', params:{itemID:'me'}},
    update: { method: 'PUT' },
    queryForSkus: {method: 'GET', isArray: false},
    count: { method: 'GET' , params: {itemID: 'count'}}
  });
});