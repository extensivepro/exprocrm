'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Bills", function ($resource) {
    return $resource(window.restful.baseURL + '/bills/:billID', {billID: '@_id'}, {
        update: { method: 'PUT' },
        count: { method: 'GET' , params: {billID: 'count'}}
    });
});