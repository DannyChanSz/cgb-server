var phoneTokens = require('../models/phoneTokens.js');
var userModel = require("../models/user.js");
var userProfileModel = require("../models/userProfile.js");
var sms = require("../plugin/sms/sms.js");
var config = require("../config/config.js");
var moment = require('moment');
var jwt = require('jwt-simple');


module.exports = {
    //手机是否存在
    checkPhone: function(req, res, done) {
        config.resHead(res);
        userModel.checkPhone(req.params.phone, function(isExistPhone) {
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
            //sms.smsSend(phone, '注册验证', code);
            res.json({
                status: true
            });
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
        var profile = req.params.userProfile;

        userModel.checkPhone(phone, function(isExistPhone) {
            //手机号不存在
            if (!isExistPhone) {

                phoneTokens.verificateIdentityCode(tokens, phone, code, function(verificateSuccess) {
                    //测试
                    if (code == '201601') {
                        verificateSuccess = true;
                    }
                    //手机验证成功
                    if (verificateSuccess) {
                        //注册
                        userModel.regist(phone, password, userType, function(resgistResult) {

                            if (resgistResult.status) {
                                userProfileModel.addProfile(resgistResult.data._id, profile);

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
        userModel.login(req.params.phone, req.params.password, req.params.userType, function(loginResult) {

            if (loginResult.status) {
                var expires = moment().add(7, 'days').valueOf();
                var token = jwt.encode({
                    iss: loginResult.data._id,
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

    },
    //获取个人资料
    getProfile: function(req, res, done) {

        config.resHead(res);
        var userId = req.userId;
        var userinfo = req.userInfo;

        userProfileModel.getProfileByUser(userId, function(getResult) {

            if (getResult.status) {

                getResult.data.phone = userinfo.phone;//加电话信息

                res.json({
                    status: true,
                    data: getResult.data
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: getResult.err
                });
                res.end();
            }


        });

    },
    //修个个人资料
    changeProfile: function(req, res, done) {
        config.resHead(res);
        var userId = req.userId;
        var profile = req.params;

        userProfileModel.updateProfileByUser(userId, profile, function(upResult) {

            if (upResult.status) {
                res.json({
                    status: true,
                    data: upResult.data
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: upResult.err
                });
                res.end();
            }


        })


    },
    //修改密码
    changePassword: function(req, res, done) {
        config.resHead(res);
        var userId = req.userId;

        userModel.changePassword(userId, req.params.oldPassword, req.params.newPassword, function(upResult) {
            if (upResult.status) {
                res.json({
                    status: true,
                    data: upResult.data
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: '请输入正确的原始密码'
                });
                res.end();
            }


        })

    }

};
