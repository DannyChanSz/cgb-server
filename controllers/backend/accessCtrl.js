var adminModel = require('../../models/context.js').admin();
var roleModel = require('../../models/context.js').role();
var adminRoleModel = require('../../models/context.js').adminRole();

var async = require('async');

var config = require("../../config/config.js");
var moment = require('moment');
var jwt = require('jwt-simple');

var _ = require("underscore");
/**
 * 访问控制
 * @type {Object}
 */
module.exports = {


    /**
     * 登陆
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    login: function(req, res, done) {

        var userName = req.params.userName;
        var password = req.params.password;



        adminModel.login(userName, password, function(result) {
            if (result.status) {
                var expires = moment().add(7, 'days').valueOf();
                var token = jwt.encode({
                    iss: userName,
                    exp: expires
                }, config.jwtTokenSecret);

                res.json({
                    status: true,
                    token: token,
                    expires: expires,
                    user: result.data
                });
                res.end()

            } else {
                res.json({
                    status: false,
                    errMsg: '用户名或密码不存在'
                });
                res.end();
            }
        })

    },
    /**
     * 获取白名单
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    getWhiteList: function(req, res, done) {

        var token = req.headers['x-access-token'];

        if (token) {
            try {
                var decoded = jwt.decode(token, config.jwtTokenSecret);

                if (decoded.exp <= Date.now()) {
                    console.log('401 登录已超时')
                    res.send(401, { message: '登录已超时' })
                    res.end()
                }

                var userName = decoded.iss;

                //用户及接口访问列表
                adminModel.getCompletelyInfos(userName, function(result) {

                    if (result.status) {

                        var roles = result.data.role;

                        var interfaces = [];

                        for (var i = 0; i < roles.length; i++) {
                            interfaces = _.union(interfaces, roles[i].interfaceList);
                        }
                        //管理员
                        req.admin = result.data;
                        done(interfaces);

                    } else {
                        res.send(401, { message: '找不到该用户' })
                        res.end()
                    }

                });

            } catch (err) {
                res.send(401, { message: 'catch err :' + err })
                res.end()
            }
        } else {

            res.send(401, { message: '请登录' })
            res.end()
        }

    },
    /**
     * 重置管理员权限
     * @param  {[type]}   req        [description]
     * @param  {[type]}   res        [description]
     * @param  {[type]}   interfaces [description]
     * @param  {Function} done       [description]
     * @return {[type]}              [description]
     */
    resetSystemAdmin: function(req, res, interfaces, done) {

        var userName = 'sysAdmin';
        var password = '123456';
        var roleName = '超级管理员';
        var interfaceList = [];
        _.each(interfaces, function(e, i, l) {
            interfaceList.push(e.route);
        })

        async.auto({
            resetAdmin: function(callback) {

                adminModel.upsert(userName, password, function(result) {
                    if (result.status) {
                        callback();
                    } else {
                        callback('resetAdmin');
                    }
                })
            },
            findAdmin: ['resetAdmin', function(callback, results) {

                adminModel.findOne({ userName: userName }, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('findAdmin');
                    }

                })

            }],
            resetRole: function(callback) {

                var filter = {
                    name: roleName
                };
                var entity = {
                    name: roleName,
                    interfaceList: interfaceList,
                    menuList: []
                }

                roleModel.upsert(filter, entity, function(result) {
                    if (result.status) {
                        callback();
                    } else {
                        callback('resetRole');
                    }
                })

            },
            findRole: ['resetRole', function(callback, results) {

                roleModel.findOne({ name: roleName }, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('findRole');
                    }
                })

            }],
            resetAdminRole: ['findAdmin', 'findRole', function(callback, results) {

                var admin = results.findAdmin;
                var role = results.findRole;
                console.log(admin, role);
                adminRoleModel.create(admin._id, role._id, function(result) {
                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('resetAdminRole');
                    }
                })
            }]

        }, function(err, results) {
            if (!err) {
                res.json({
                    status: true,
                    data: results.resetAdminRole
                });
                res.end();
            } else {

                res.json({
                    status: false,
                    errMsg: err
                })
                res.end();
            }

        })




    }



}