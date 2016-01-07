var phoneTokens = require('../models/phoneTokens.js');
var user = require("../models/user.js");
var userProfile = require("../models/userProfile.js");
var sms = require("../plugin/sms/sms.js");
var config = require("../config/config.js");
var moment = require('moment');
var jwt = require('jwt-simple');


module.exports = {
    //手机是否存在
    checkPhone: function(req, res, done) {
        config.resHead(res);
        user.checkPhone(req.params.phone, function(isExistPhone) {
            res.json({
                status: isExistPhone
            });
            res.end();
        })
    },
    //发送手机验证码
    sendPhoneToken: function(req, res, done) {
        config.resHead(res);
        var tokens = req.params.tokens;
        var phone = req.params.phone;
        phoneTokens.generateIdentityCode(tokens, phone, function(code) {
            // sms.smsSend(phone, '注册验证', code);
            res.end();
        })

    },
    //注册
    regist: function(req, res, done) {
        config.resHead(res);
        //res.charSet('utf8');
        var tokens = req.params.tokens;
        var phone = req.params.phone;
        var code = req.params.code;
        var password = req.params.password;
        var userType = req.params.userType;
        var userProfile = req.params.userProfile;

        user.checkPhone(phone, function(isExistPhone) {
            //手机号不存在
            if (!isExistPhone) {

                phoneTokens.verificateIdentityCode(tokens, phone, code, function(verificateSuccess) {
                    //手机验证成功
                    if (verificateSuccess) {
                        //注册
                        user.regist(phone, password, userType, function(resgistResult) {

                            if (resgistResult.status) {
                                userProfile.AddProfile(resgistResult.data.userId, userProfile);

                                res.json({
                                    status: true,
                                    data: resgistResult.data
                                });
                                res.end();
                            } else {
                                res.json({
                                    status: false,
                                    errMsg: resgistResult.err
                                });
                                res.end();
                            }
                        });

                    } else {
                        res.json({
                            status: false,
                            errMsg: '请输入正确的手机验证码'
                        });
                        res.end();
                    }
                })

            } else {
                res.json({
                    status: false,
                    errMsg: '手机号码已存在'
                });
                res.end();
            }

        });

    },
    //按身份登陆
    login: function(req, res, done) {
        config.resHead(res);
        user.login(req.params.phone, req.params.password, req.params.userType, function(loginResult) {

            if (loginResult.success) {
                var expires = moment().add(7, 'days').valueOf();
                var token = jwt.encode({
                    iss: user,
                    exp: expires
                }, config.jwtTokenSecret);

                res.json({
                    status: true,
                    token: token,
                    expires: expires,
                    user: loginResult.data
                });
                return next();

            } else {
                res.json({
                    status: false,
                    user: loginResult.data
                });
                return next();
            }
        })



    }


};
