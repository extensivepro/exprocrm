'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Shops", function($resource){
  return $resource(window.restful.baseURL+'/shops/:shopID', {shopID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {shopID: 'count'}}
  });
});