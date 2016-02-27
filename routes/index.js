var config = require('../config/config.js');

module.exports = function(server, restify, rootDirName) {

    /**
     * 公共资源访问
     * @type {[type]}
     */
    server.get(/public\/?.*/, restify.serveStatic({
        directory: rootDirName
    }));


    /**-------前台路由-------**/

    require('./frontend/user.js')(server);

    require('./frontend/order.js')(server);

    require('./frontend/keyword.js')(server);

    require('./frontend/upload.js')(server);

    /**-------后台路由-------**/

    /**
     * 管理员及角色权限管理
     */
    require('./backend/admin.js')(server);

    /**
     * 会员管理
     */
    require('./backend/user.js')(server);

    /**
     * 订单、报价单管理 
     */
    require('./backend/order.js')(server);

    /**
     * 添加query访问方式路由
     */
    creatRedirectRoutes(server);
}

/**
 * 生成重定向路由
 * 用于支持多个参数的GET方法query访问方式
 * 如：将原路由 /foo/:id/:name 生成 /foo/:id:name 并重定向到原路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
function creatRedirectRoutes(server) {

    server.router.routes.GET.forEach(
        function(routeInfo) {

            var path = routeInfo.spec.path.toString();

            var star = path.indexOf('/:');
            if (star > -1) {
                var routePath = path.slice(0, star + 2);
                var paramsPath = path.slice(star + 2);

                var newPath = routePath + paramsPath.replace(/\/:/g, ':');

                if (path != newPath) {
                    //生成重定向路由
                    server.get({
                        path: newPath,
                        version: '0.0.1'
                    }, function(req, res) {
                        var redirectPath = render(path, req.params);
                        res.redirect(301, redirectPath, function() {});
                        
                    });
                }
            }

        }
    );

}

/**
 * 生成实际路由地址
 * 源自restify/lib/router.js
 * 如: path='／foo/:id/:name' params={id:1,name:2} return /foo/1/2
 * @param  {[type]} path   [route path]
 * @param  {[type]} params [route params]
 * @return {[type]}        [redirect url]
 */
function render(path, params) {

    function pathItem(match, key) {
        if (params.hasOwnProperty(key) === false) {
            throw new Error('Route <' + routeName +
                '> is missing parameter <' +
                key + '>');
        }
        return ('/' + encodeURIComponent(params[key]));
    }
    var _url = path.replace(/\/:([A-Za-z0-9_]+)(\([^\\]+?\))?/g, pathItem);
    return _url;
}

