'use strict';

/* jasmine specs for services go here */

describe('User Service', function(){
  var $httpBackend, Users;
  
  beforeEach(module('exproCRM.services'));
  beforeEach(inject(function($injector){
    $httpBackend = $injector.get('$httpBackend');
    Users = $injector.get('Users');
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('Create User', function(){
    it('should succeed', function(){
      $httpBackend.expectPOST('http://service.fankahui.com:2403/users').respond({id:'154d4534a48e475'});
      // $httpBackend.expectPOST('/users').respond({id:'154d4534a48e475'});
      var user = {
          username: "18912345678",
          password: "123456"
      };
      Users.save(user, function (data) {
        expect(data.id).toEqual('154d4534a48e475');
      });
      $httpBackend.flush();
    });
  });
});