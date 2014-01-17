'use strict';

//Statistics service used for statistics REST endpoint

angular.module('exproCRM.services').factory("Statistics", function ($resource) {
    return $resource(window.restful.baseURL + '/statistics', {}, {
        stat: { method: 'GET', params: {period: 'daily'}, isArray:true }
    });
});