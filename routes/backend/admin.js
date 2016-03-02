var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var adminCtrl = require('../../controllers/backend/adminCtrl.js');

var roleCtrl = require('../../controllers/backend/roleCtrl.js');

var adminRoleCtrl = require('../../controllers/backend/adminRoleCtrl.js');


module.exports = function(server) {

    /*------------管理员-----------*/
    var PATH_ADMIN = '/backend/admin';

    /**
     * 获取完整管理员信息
     */
    server.get({
        path: PATH_ADMIN + '/getCompletelyInfos/:userName',
        version: '0.0.1'
    }, adminCtrl.getCompletelyInfos);

    /**
     * 新增管理员
     * userName,password
     */
    server.post({
        path: PATH_ADMIN + '/create',
        version: '0.0.1'
    }, adminCtrl.create);

    /**
     * 修改密码
     * userName,password
     */
    server.post({
        path: PATH_ADMIN + '/changePassword',
        version: '0.0.1'
    }, adminCtrl.changePassword);


    /**
     * 禁用/解禁管理员
     * userName,isLockout
     */
    server.post({
        path: PATH_ADMIN + '/changeLockout',
        version: '0.0.1'
    }, adminCtrl.changeLockout);




    /*------------角色-----------*/
    var PATH_ROLE = '/backend/role';


    /**
     * 查询角色列表
     */
    server.get({
        path: PATH_ROLE + '/findAll',
        version: '0.0.1'
    }, roleCtrl.findAll);

    /**
     * 添加角色
     * name
     */
    server.post({
        path: PATH_ROLE + '/create',
        version: '0.0.1'
    }, roleCtrl.create);

    /**
     * 设置接口权限
     * id,inferfaceList(['',''])
     */
    server.post({
        path: PATH_ROLE + '/setInterfaceList',
        version: '0.0.1'
    }, roleCtrl.setInterfaceList);


    /*------------权限-----------*/
    var PATH_ADMIN_ROLE = '/backend/adminRole';

    /**
     * 添加权限（管理员角色关系）
     * adminId,roleId
     */
    server.post({
        path: PATH_ADMIN_ROLE + '/create',
        version: '0.0.1'
    }, adminRoleCtrl.create);

    /**
     * 删除权限
     * id
     */
    server.post({
        path: PATH_ADMIN_ROLE + '/remove',
        version: '0.0.1'
    }, adminRoleCtrl.remove);

}
