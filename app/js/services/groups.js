/**
 * @description
 * @author tsq <1530234656@qq.com>.
 * @date 14-5-26
 */
angular.module('exproRMS.services').factory("Groups", function($resource){
  return $resource(window.restful.baseURL+'/groups/:groupID', {groupID:'@id'}, {
    update: { method: 'PUT' },
    count: { method: 'GET' , params: {groupID: 'count'}}
  });
});