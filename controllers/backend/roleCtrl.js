var roleModel = require('../../models/context.js').role();
var _ = require("underscore");
var async = require("async");

/**
 * 角色管理
 * @type {Object}
 */
module.exports = {

    /**
     * 新增角色
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    create: function(req, res, done) {

        var name = req.params.name;

        async.auto({
            checkName: function(callback) {
                roleModel.checkName(name, function(result) {
                    if (result.status && (!result.data)) {
                        callback();
                    } else {
                        callback('角色名已存在');
                    }
                })
            },
            create: ['checkName', function(callback, results) {
                roleModel.create({
                    name: name,
                    inferfaceList: []
                }, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('添加失败')
                    }
                });
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
     * 角色列表
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findAll: function(req, res, done) {

        roleModel.findAll({}, function(result) {
            res.json(result);
            res.end();
        })

    },

    /**
     * 设置接口权限
     * @param {[type]}   req  [description]
     * @param {[type]}   res  [description]
     * @param {Function} done [description]
     */
    setInterfaceList: function(req, res, done) {

        var id = req.params.id;
        var inferfaceList = req.params.inferfaceList;

        if (!(_.isArray(inferfaceList))) {
            inferfaceList = [];
        }

        roleModel.setInterfaceList(id, inferfaceList, function(result) {

            res.json(result);
            re.end();
        })

    }










}
