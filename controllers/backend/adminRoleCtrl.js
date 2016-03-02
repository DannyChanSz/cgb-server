var adminRoleModel = require('../../models/context.js').adminRole();
//var _ = require("underscore");
var async = require("async");



/**
 * 权限管理
 * @type {Object}
 */
module.exports = {

    /**
     * 添加管理员角色关系
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    create: function(req, res, done) {

        var adminId = req.params.adminId;
        var roleId = req.params.roleId;

        adminRoleModel.create(adminId, roleId, function(result) {
            res.json(result);
            res.end();
        })


    },
    /**
     * 删除
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    remove: function(req, res, done) {

        var id = req.params.id;

        adminRoleModel.removeById(id, function(result) {
            res.json(result);
            res.end();
        })

    }




}
