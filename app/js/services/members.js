'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Members", function ($resource) {
    return $resource(window.restful.baseURL + '/members/:memberID', {memberID: '@_id'}, {
        update: { method: 'PUT' } ,
        count: { method: 'GET' , params: {memberID: 'count'}}
    });
});