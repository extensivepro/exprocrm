'use strict';

//User service used for users REST endpoint

angular.module('exproRMS.services').factory("Devices", function($resource){
  return $resource(window.restful.baseURL+'/devices/:deviceID', {deviceID:'@_id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {deviceID: 'count'}}
  });
});

angular.module('exproRMS.services').factory("DeviceRegister", function($resource){
  return $resource(window.restful.baseURL+'/device-register');
});