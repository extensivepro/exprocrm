'use strict';

//Statistics service used for statistics REST endpoint

angular.module('exproCRM.services').factory("Statistics", function($resource) {
  var Statistics = function (keyID) {
    this.keyID = keyID
    this.period = 'daily'
    this.limit = 10
    this.end = 0
    this.resource = $resource(window.restful.baseURL + '/statistics', {}, {})
    this.query = function (cb) {
      return this.resource.query({
        keyID: this.keyID,
        period: this.period,
        limit: this.limit,
        end: this.end
      },cb)
    }
  } 

  Statistics.prototype.until = function (d) {
    if (this.period === 'daily') {
      this.end = parseInt(d.getTime() / 86400000, 10);
    } else if (this.period === 'weekly') {
      this.end = parseInt(d.getTime() / 604800000, 10);
    } else if (this.period === 'monthly') {
      this.end = (d.getFullYear() - 1970) * 12 + d.getMonth();
    }
    return this.end
  }

  Statistics.prototype.periodDate = function (units) {
    if (this.period === 'daily') {
      return new Date(86400000*units)
    } else if ( this.period === 'weekly' ) {
      return new Date(604800000*units+3*86400000)
    } else if ( this.period === 'monthly' ) {
      return new Date(1970, units, 1, 8)
    }
  }
  
  return Statistics
})
