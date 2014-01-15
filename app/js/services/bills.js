'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Bills", function ($resource) {
    return $resource(window.restful.baseURL + '/bills/:billID', {billID: '@_id'}, {
        login: {method: 'POST', params: {billID: 'login'}},
        logout: {method: 'POST', params: {billID: 'logout'}},
        me: {method: 'GET', params: {billID: 'me'}},
        update: { method: 'PUT' }
    });
});