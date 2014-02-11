'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Deals", function ($resource) {
    return $resource(window.restful.baseURL + '/deals/:dealID', {dealID: '@_id', $sort:{createdAt:-1}}, {
        update: { method: 'PUT' }
    });
});