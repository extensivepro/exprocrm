'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Deals", function ($resource) {
    return $resource(window.restful.baseURL + '/deals/:dealID', {dealID: '@_id'}, {
        update: { method: 'PUT' },
        count: { method: 'GET' , params: {dealID: 'count'}}
    });
});