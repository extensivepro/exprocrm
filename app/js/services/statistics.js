'use strict';

//Statistics service used for statistics REST endpoint

angular.module('exproCRM.services').factory("Statistics", function($resource) {
  var Statistics = $resource(window.restful.baseURL + '/statistics')

  Statistics.until = function (d, period) {
    if (period === 'daily') {
      return parseInt(d.getTime() / 86400000, 10);
    } else if (period === 'weekly') {
      return parseInt(d.getTime() / 604800000, 10);
    } else if (period === 'monthly') {
      return (d.getFullYear() - 1970) * 12 + d.getMonth();
    }
  }

  Statistics.periodDate = function (units, period) {
    if (period === 'daily') {
      return new Date(86400000*units)
    } else if ( period === 'weekly' ) {
      return new Date(604800000*units+3*86400000)
    } else if ( this.period === 'monthly' ) {
      return new Date(1970, units, 1, 8)
    }
  }
  
  return Statistics
})
