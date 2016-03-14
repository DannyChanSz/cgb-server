var adminRoleModel = require('../../models/context.js').adminRole();

var _ = require("underscore");
var async = require("async");

var MAX_QUEUE_COUNT = 5;

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

    },
    /**
     * 设置管理员角色关系
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    upsert: function(req, res, done) {

        var adminId = req.params.adminId;
        var roles = req.params.roles;

        if (!_.isArray(roles)) {
            roles = [];
        }

        async.auto({
            remove: function(callback) {
                adminRoleModel.removeByAdminId(adminId, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('remove');
                    }
                })
            },
            setMaps: ['remove', function(callback, results) {

                var q = async.queue(function(roleId, qcb) {

                    adminRoleModel.create(adminId, roleId, function(result) {

                        if (result.status) {
                            qcb()
                        } else {
                            qcb('setMaps');
                        }

                    });

                }, MAX_QUEUE_COUNT)

                q.push(roles);

                q.drain = function() {
                    callback(null, roles.length);
                }


            }]
        }, function(err, results) {

            if (!err) {
                res.json({
                    status: true,
                    data: results.setMaps
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: err
                });
                res.end();
            }
        })



    }




}
