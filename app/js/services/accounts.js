'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Accounts", function ($resource) {
    return $resource(window.restful.baseURL + '/accounts/:accountID', {accountID: '@_id'}, {
        update: { method: 'PUT' }
    });
});