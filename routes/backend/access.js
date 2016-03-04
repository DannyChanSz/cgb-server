var accessCtrl = require('../../controllers/backend/accessCtrl.js');

var _ = require('underscore');


/**
 * 访问控制
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {

    var PATH = '/backend/access'

    /**
     * 管理员登陆
     */
    server.get({
        path: PATH + '/login/:userName/:password',
        version: '0.0.1'
    }, accessCtrl.login);

    /**
     * 获取后台接口
     */
    server.get({
        path: PATH + '/getAllInferfaces',
        version: '0.0.1'
    }, function(req, res, done) {

        var inferfaces = [];
        server.router.routes.GET.forEach(function(route) {
            var path = {
                method: 'get',
                route: route.spec.path.toString()
            }
            inferfaces.push(path);
            inferfaces = _.sortBy(inferfaces, 'route');
        });

        server.router.routes.POST.forEach(function(route) {
            var path = {
                method: 'post',
                route: route.spec.path.toString()
            }
            inferfaces.push(path);
        });

        res.json(inferfaces);
        res.end();
    });

}
