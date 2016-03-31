var tokenContainer = new Array();

var phoneTokens = require('../models/phoneTokens.js');
phoneTokens.checkTokenTimeoutStar(tokenContainer); //检查过期服务


var userModel = require("../models/user.js");
var orderModel = require("../models/order.js");

module.exports = {

    //为token服务提供资源
    tokenMiddle: function(req, res, done) {
        req.params.tokens = tokenContainer;
        done();
    },
    //作用于jwtauth之后
    //提供已验证权限用户具体信息
    getUserInfo: function(req, res, done) {

        if (req.userId) {
            var userId = req.userId;

            userModel.getByUserId(userId, function(getResult) {
                if (getResult.status) {

                    req.userInfo = getResult.data;
                    //console.info('md-getUserInfo',req.userInfo);
                    done();

                } else {
                    res.end("can not find user");
                }

            })

        } else {
            res.end("use getUserInfo after jwtauth");
        }
    },
    getOrderInfo: function(req, res, done) {
        if (req.params.orderName) {

            orderModel.getByOrderName(req.params.orderName,
                function(orderResult) {
                    if (orderResult.status) {
                        req.orderInfo = orderResult.data;
                        done();
                    } else {
                        res.end('middleware: order is not found');
                    }

                });


        } else {
            res.end('can not find  req.params.orderName');
        }
    }

}
