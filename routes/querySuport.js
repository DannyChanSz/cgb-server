/**
 * 添加支持query访问方式的路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {


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
            throw new Error('Route <' + path +
                '> is missing parameter <' +
                key + '>');
        }
        return ('/' + encodeURIComponent(params[key]));
    }
    var _url = path.replace(/\/:([A-Za-z0-9_]+)(\([^\\]+?\))?/g, pathItem);
    return _url;
}