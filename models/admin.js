var config = require("../config/config.js");


var help = require('./help.js');
var _ = require("underscore");
var async = require('async');

var admin = config.db.collection("admin");

var adminRole = config.db.collection("adminRole");
var role = config.db.collection("role");

var MAX_QUEUE = 5;
/**
 * 管理员
 * id,userName,hashPassword,isLockout,createdOn
 * @return {[type]} [description]
 */
module.exports = {

    /**
     * 用户名检查
     * @param  {[type]}   userName [description]
     * @param  {Function} done     [description]
     * @return {[type]}            [description]
     */
    checkUserName: function(userName, done) {

        admin.findOne({ userName: userName }, _.partial(help.defaultCall, _, _, done))

    },

    /**
     * 添加管理员
     * @param  {[type]}   userName [description]
     * @param  {[type]}   password [description]
     * @param  {Function} done     [description]
     * @return {[type]}            [description]
     */
    create: function(userName, password, done) {

        var passwordSha = help.getHashPassword(password);
        var entity = {
            userName: userName,
            hashPassword: passwordSha,
            isLockout: false,
            createdOn: new Date()
        }

        admin.insert(entity, _.partial(help.defaultCall, _, _, done));

    },

    /**
     * 修改密码
     * @param  {[type]}   userName [description]
     * @param  {[type]}   password [description]
     * @param  {Function} done     [description]
     * @return {[type]}            [description]
     */
    changePassword: function(userName, password, done) {

        var passwordSha = help.getHashPassword(password);
        var entity = {
            hashPassword: passwordSha
        }

        admin.update({
            userName: userName
        }, {
            $set: entity
        }, _.partial(help.defaultCall, _, _, done));

    },
    /**
     * 完整用户信息
     * @return {[type]} [description]
     */
    getCompletelyInfos: function(userName, done) {
        var completeInfo = {};

        async.auto({
            findAdmin: function(callback) {

                admin.findOne({
                    userName: userName
                }, function(err, success) {
                    if (success) {
                        completeInfo = success;
                        callback(null, success)
                    } else {
                        callback('无此用户');
                    }
                })
            },
            findAdminRole: ['findAdmin', function(callback, results) {
                var adminEntity = results.findAdmin;
                var filter = {
                    adminId: config.mongojs.ObjectId(adminEntity._id)
                }
                adminRole.find(filter, function(err, success) {
                    if (success) {
                        callback(null, success);
                    } else {
                        callback('findAdminRole');
                    }

                })


            }],
            findRole: ['findAdminRole', function(callback, results) {
                var maps = results.findAdminRole;

                completeInfo.role = [];

                var q = async.queue(function(map, qCallback) {

                    role.findOne({
                        _id: config.mongojs.ObjectId(map.roleId)
                    }, function(err, success) {
                        if (success) {
                            completeInfo.role.push(success);
                        }
                        qCallback()
                    })

                }, MAX_QUEUE);

                q.push(maps);

                q.drain = function() {
                    callback(null, completeInfo);
                }


            }]

        }, function(err, results) {
            if (!err) {
                done({
                    status: true,
                    data: results.findRole
                })
            } else {
                done({
                    status: false,
                    errMsg: err
                })
            }

        })

    },
    /**
     * 登陆
     * @param  {[type]}   userName [description]
     * @param  {[type]}   password [description]
     * @param  {Function} done     [description]
     * @return {[type]}            [description]
     */
    login: function(userName, password, done) {

        var passwordSha = help.getHashPassword(password);

        admin.findOne({
            userName: userName,
            hashPassword: passwordSha
        }, _.partial(help.defaultCall, _, _, done));

    }




}
