'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Orders", function ($resource) {
    return $resource(window.restful.baseURL + '/orders/:ordersID', {ordersID: '@_id'}, {
        count: { method: 'GET' , params: {ordersID: 'count'}}
    });
});