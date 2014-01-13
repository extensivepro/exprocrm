'use strict';

//User service used for users REST endpoint


angular.module('exproCRM.services').factory("Users", function($resource){
	return $resource(window.restful.baseURL+'/users/:userID', {userID:'@id'}, {
		login: {method: 'POST', params:{userID:'login'}},
		logout: {method: 'POST', params:{userID:'logout'}},
    me: {method: 'GET', params:{userID:'me'}},
		update: { method: 'PUT' }
	});

});