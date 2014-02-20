'use strict';

//User service used for users REST endpoint

angular.module('exproCRM.services').factory("Devices", function($resource){
  return $resource(window.restful.baseURL+'/devices/:deviceID', {deviceID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {deviceID: 'count'}}
  });
});

angular.module('exproCRM.services').factory("DeviceRegister", function($resource){
  return $resource(window.restful.baseURL+'/device-register');
});