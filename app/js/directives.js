'use strict';

/* Directives */


angular.module('exproRMS.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('formAutofillFix', function($timeout) {
    return function(scope, elem, attrs) {
      if(attrs.ngSubmit) {
        $timeout(function() {
          elem.unbind('submit').submit(function(e) {
            e.preventDefault();
            elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
            scope.$apply(attrs.ngSubmit);
          });
        });
      }
    };
  });
