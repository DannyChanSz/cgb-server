var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var adminCtrl = require('../../controllers/backend/adminCtrl.js');

var roleCtrl = require('../../controllers/backend/roleCtrl.js');

var adminRoleCtrl = require('../../controllers/backend/adminRoleCtrl.js');


module.exports = function(server) {

    /*------------管理员-----------*/
    var PATH_ADMIN = '/backend/admin';

    /**
     * 获取管理员列表
     */
    server.get({
        path: PATH_ADMIN + '/findAll',
        version: '0.0.1'
    }, adminCtrl.findAll);

    /**
     * 获取完整管理员信息
     */
    server.get({
        path: PATH_ADMIN + '/getCompletelyInfos/:id',
        version: '0.0.1'
    }, adminCtrl.getCompletelyInfos);


    /**
     * 菜单权限
     */
    server.get({
        path: PATH_ADMIN + '/getMenuList/:userName',
        version: '0.0.1'
    }, adminCtrl.getMenuList);

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
     * 角色详细
     */
    server.get({
        path: PATH_ROLE + '/findOne/:id',
        version: '0.0.1'
    }, roleCtrl.findOne);


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
     * id,interfaceList(['',''])
     */
    server.post({
        path: PATH_ROLE + '/setInterfaceList',
        version: '0.0.1'
    }, roleCtrl.setInterfaceList);

    /**
     * 设置目录权限
     * id,menuList
     * 其中menuList格式
     *     [{
     *          title: '会员管理'
     *          items: [{ title: '会员列表', path: '/user' }]
     *      }, {
     *          title: '权限管理',
     *          items: [
     *              { title: '管理员管理', path: '/admin' },
     *              { title: '角色管理', path: '/role' }
     *          ]
     *      }]
     */
    server.post({
        path: PATH_ROLE + '/setMenuList',
        version: '0.0.1'
    }, roleCtrl.setMenuList);



    /*------------权限-----------*/
    var PATH_ADMIN_ROLE = '/backend/adminRole';

    // /**
    //  * 添加权限（管理员角色关系）
    //  * adminId,roleId
    //  */
    // server.post({
    //     path: PATH_ADMIN_ROLE + '/create',
    //     version: '0.0.1'
    // }, adminRoleCtrl.create);

    // /**
    //  * 删除权限
    //  * id
    //  */
    // server.post({
    //     path: PATH_ADMIN_ROLE + '/remove',
    //     version: '0.0.1'
    // }, adminRoleCtrl.remove);

    /**
     * 设置管理员角色关系
     * adminId,roles([roleId,roleId])
     */
    server.post({
        path: PATH_ADMIN_ROLE + '/upsert',
        version: '0.0.1'
    }, adminRoleCtrl.upsert);


}
