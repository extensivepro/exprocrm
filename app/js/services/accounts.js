'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Accounts", function ($resource) {
    return $resource(window.restful.baseURL + '/accounts/:accountID', {accountID: '@_id'}, {
        update: { method: 'PUT' }
    });
});