'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Items", function($resource){
  return $resource(window.restful.baseURL+'/items/:itemID', {itemID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {itemID: 'count'}}
  });
});

angular.module('exproRMS.services').factory("ImportItems", function($resource){
  return $resource(window.restful.baseURL+'/import-items/:itemID', {itemID:'@_id'}, {
    batchImport: { method: 'POST', isArray: true}
  });
});