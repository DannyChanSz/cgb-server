var phoneTokens = require('../models/phoneTokens.js');
var user = require("../models/user.js");

module.exports = {
    //手机是否存在
    checkPhone: function(req, res, done) {
        user.checkPhone(req.params.phone, function(isExistPhone) {
            res.json({
                status: isExistPhone
            });
            res.end();
        })
    },
    //发送手机验证码
    sendPhoneToken: function(req, res, done) {
        var tokens = req.params.tokens;
        var phone = req.params.phone;
        var sms = require("../plugin/sms/sms.js");
        
        phoneTokens.generateIdentityCode(tokens, phone, function(code) {
            sms.smsSend(phone, '注册验证', code);
            res.end();
        })

    },
    //注册
    regist: function(req, res, done) {
        var tokens = req.params.tokens;
        var phone = req.params.phone;
        var code = req.params.code;
        var password = req.params.phone;
        var userType = req.params.userType;

        user.checkPhone(phone, function(isExistPhone) {
            //手机号不存在
            if (!isExistPhone) {

                phoneTokens.verificateIdentityCode(tokens, phone, code, function(verificateSuccess) {
                    //手机验证成功
                    if (verificateSuccess) {
                        //注册
                        user.regist(phone, password, userType, function(resgistResult) {

                            res.json({
                                status: resgistResult.success,
                                errMsg: resgistResult.err
                            });
                            res.end();

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


};
