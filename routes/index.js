var config = require('../config/config.js');

module.exports = function(server, restify, rootDirName) {

    /**
     * 公共资源访问
     * @type {[type]}
     */
    server.get(/public\/?.*/, restify.serveStatic({
        directory: rootDirName
    }));

    /**
     * 全局访问控制
     */
    require('./access.js')(server);

    /**-------前台路由-------**/

    require('./frontend/user.js')(server);

    require('./frontend/order.js')(server);

    require('./frontend/keyword.js')(server);

    require('./frontend/upload.js')(server);

    require('./frontend/pay.js')(server);

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
     * 路由访问控制
     */
    require('./backend/access.js')(server);


    /**-------全局配置-------**/

    /**
     * 支持query方式访问
     */
    require('./querySuport.js')(server);





}
