'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Members", function ($resource) {
    return $resource(window.restful.baseURL + '/members/:memberID', {memberID: '@_id'}, {
        update: { method: 'PUT' }
    });
});