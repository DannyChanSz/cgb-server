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
                    interfaceList: [],
                    menuList: []
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
        var interfaceList = req.params.interfaceList;

        if (!(_.isArray(interfaceList))) {
            interfaceList = [];
        }

        roleModel.setInterfaceList(id, interfaceList, function(result) {

            res.json(result);
            re.end();
        })

    },
    /**
     * 设置目录权限
     * @param {[type]}   req  [description]
     * @param {[type]}   res  [description]
     * @param {Function} done [description]
     */
    setMenuList: function(req, res, done) {

        var id = req.params.id;
        var menuList = req.params.menuList;

        if (!(_.isArray(menuList))) {
            menuList = [];
        }

        roleModel.setMenuList(id, menuList, function(result) {

            res.json(result);
            re.end();
        })


    },
    /**
     * [findOne description]

     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findOne: function(req, res, done) {
        var id = req.params.id;

        roleModel.findById(id, function(result) {
            res.json(result);
            res.end();
        })


    }









}
