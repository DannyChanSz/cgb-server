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
        path: PATH + '/getAllInterfaces',
        version: '0.0.1'
    }, function(req, res, done) {

        var interfaces = getInterfaces(server);
        res.json({
            status: true,
            data: interfaces
        });
        res.end();
    });


    /**
     * 重置管理员权限
     * @param  {[type]} req   [description]
     * @param  {[type]} res   [description]
     * @param  {[type]} done) {               } [description]
     * @return {[type]}       [description]
     */
    server.post({
        path: PATH + '/resetSystemAdmin',
        version: '0.0.1'
    }, function(req, res, done) {

        var interfaces = getInterfaces(server);

        accessCtrl.resetSystemAdmin(req, res, interfaces, done);

    });


}

/**
 * 获取接口
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
function getInterfaces(server) {
    var interfaces = [];
    server.router.routes.GET.forEach(function(route) {
        var path = {
            method: 'get',
            route: route.spec.path.toString()
        }
        interfaces.push(path);
        interfaces = _.sortBy(interfaces, 'route');
    });

    server.router.routes.POST.forEach(function(route) {
        var path = {
            method: 'post',
            route: route.spec.path.toString()
        }
        interfaces.push(path);
    });

    return interfaces;
}
