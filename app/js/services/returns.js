'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Returns", function ($resource) {
    return $resource(window.restful.baseURL + '/returns/:returnID', {returnID: '@_id'}, {
        login: {method: 'POST', params: {returnID: 'login'}},
        logout: {method: 'POST', params: {returnID: 'logout'}},
        me: {method: 'GET', params: {returnID: 'me'}},
        update: { method: 'PUT' }
    });
});