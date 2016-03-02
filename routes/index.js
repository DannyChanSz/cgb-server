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
     * 支持query方式访问
     */
    require('./querySuport.js')(server);

    /**
     * 权限过滤
     */
    require('./auth.js')(server);


}



