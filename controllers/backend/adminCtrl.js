var async = require('async');
var adminModel = require('../../models/context.js').admin();
var _ = require('underscore');

/**
 * 管理员账号管理
 * @type {Object}
 */
module.exports = {
    /**
     * 管理员列表
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findAll: function(req, res, done) {

        adminModel.findAll({}, function(result) {
            res.json(result);
            res.end();
        })

    },

    /**
     * 添加管理员帐号
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    create: function(req, res, done) {

        var userName = req.params.userName;
        var password = req.params.password;

        async.auto({
            checkUserName: function(callback) {

                adminModel.checkUserName(userName, function(result) {
                    console.log(result);
                    if (!result.status ) {
                        callback()
                    } else {
                        callback('用户名已存在');
                    }
                })
            },
            create: ['checkUserName', function(callback, results) {

                adminModel.create(userName, password, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('添加失败');
                    }
                })
            }]

        }, function(err, results) {
            if (!err) {
                res.json({
                    status: true,
                    data: results.create
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

    },
    /**
     * 修改密码
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    changePassword: function(req, res, done) {

        var userName = req.params.userName;
        var password = req.params.password;

        adminModel.changePassword(userName, password, function(result) {
            res.json(result)
            res.end();
        })
    },
    /**
     * 解/禁用帐号
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    changeLockout: function(req, res, done) {

        var userName = req.params.userName;
        var isLockout = req.params.isLockout;

        var filter = { userName: userName };
        var entity = { isLockout: isLockout }

        adminModel.update(filter, entity, function(result) {
            res.json(result)
            res.end();
        })

    },
    /**
     * 获取管理员完整信息
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    getCompletelyInfos: function(req, res, done) {

        var id = req.params.id;

        async.auto({
            findAdmin: function(callback) {

                adminModel.findById(id, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('findAdmin');
                    }
                })

            },
            getCompletelyInfos: ['findAdmin', function(callback, results) {

                var admin = results.findAdmin;
                adminModel.getCompletelyInfos(admin.userName, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('getCompletelyInfos');
                    }
                })

            }]
        }, function(err, results) {
            if (!err) {
                res.json({
                    status: true,
                    data: results.getCompletelyInfos
                })
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: err
                })
                res.end();
            }

        })


    },
    /**
     * [getMenuList description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    getMenuList: function(req, res, done) {

        var userName = req.params.userName;

        adminModel.getCompletelyInfos(userName, function(result) {
            if (result.status) {

                var roles = result.data.role;
                var menus = [];

                _.each(roles, function(e, i, l) {
                    menus = _.union(e.menuList, menus);
                })


                res.json({
                    status: true,
                    data: menus
                });
                res.end();

            } else {
                res.json({
                    status: false,
                    errMsg: result.errMsg
                });
                res.end();
            }

        })


    }






}
