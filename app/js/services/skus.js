'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Skus", function ($resource) {
  return $resource(window.restful.baseURL + '/skus/:skusID', {skusID: '@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET', params: {skusID: 'count'}}
  });
});