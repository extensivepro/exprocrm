'use strict';

/* Directives */


angular.module('exproCRM.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('autofill', function() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        scope.$on('autofill-submit', function(e) {
          ngModel.$setViewValue(element.val());
        });
      }
    }
  }).
  directive('autofillSubmit', ['$parse', function($parse) {
    return {
      link: function (scope, element) {
        var fn = $parse(element.attr('autofill-submit'));
        element.on('submit', function(event) {
          scope.$broadcast('autofill-submit');
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      }
    }
  }]);
