'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Skus", function ($resource) {
  return $resource(window.restful.baseURL + '/skus/:skusID', {skusID: '@_id', $sort:{createdAt:-1}}, {
    update: { method: 'PUT' },
    count: { method: 'GET', params: {skusID: 'count'}}
  });
});