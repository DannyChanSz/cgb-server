var adminModel = require('../../models/context.js').admin();


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

                    res.send(401, { message: '登录已超时' })
                    res.end()
                }

                var userName = decoded.iss;

                //用户及接口访问列表
                adminModel.getCompletelyInfos(userName, function(result) {

                    if (result.status) {

                        var roles = result.data.role;

                        var inferfaces = [];

                        for (var i = 0; i < roles.length; i++) {
                            inferfaces = _.union(inferfaces, roles[i].inferfaceList);
                        }

                        done(inferfaces);

                    } else {
                        res.send(401, { message: '找不到该用户' })
                        res.end()
                    }

                });

            } catch (err) {
                res.send(401, { message: err })
                res.end()
            }
        } else {

            res.send(401, { message: '请登录' })
            res.end()
        }

    }



}
