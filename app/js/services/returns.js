'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Returns", function ($resource) {
  return $resource(window.restful.baseURL + '/returns/:returnID', {returnID: '@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET', params: {returnID: 'count'}}
  });
});