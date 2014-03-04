'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Items", function($resource){
  return $resource(window.restful.baseURL+'/items/:itemID', {itemID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {itemID: 'count'}}
  });
});