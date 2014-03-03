'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Points", function ($resource) {
    return $resource(window.restful.baseURL + '/points/:pointsID', {pointsID: '@_id'}, {
        update: { method: 'PUT' },
        count: { method: 'GET' , params: {pointsID: 'count'}}
    });
});