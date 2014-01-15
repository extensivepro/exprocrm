'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Points", function ($resource) {
    return $resource(window.restful.baseURL + '/points/:pointsID', {pointsID: '@_id'}, {
        update: { method: 'PUT' }
    });
});