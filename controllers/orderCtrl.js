var config = require("../config/config.js");
var orderModel = require("../models/order.js");
var userModel = require("../models/user.js");
var _ = require("underscore");
var async = require("async");

module.exports = {

    //添加订单
    addOrder: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        if (userinfo.userType == '采购商') {
            var paramsOrder = req.params;
            var userId = req.userId;

            //权限中间件用户信息
            paramsOrder.purUserId = userId;

            orderModel.addOrder(paramsOrder, function(result) {

                if (result.status) {
                    res.json({
                        status: true,
                        data: result.data
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: result.err
                    });
                    res.end();
                }

            })
        } else {
            res.json({
                status: false,
                errMsg: '无采购商权限'
            });
            res.end();
        }
    },
    //获取订单列表[待添加权限]
    getMyNewOrders: function(req, res, done) {

        config.resHead(res);
        var userId = req.userId;
        var endtime = new Date(req.params.endTime);
        //添加userType

        orderModel.getOrderByUserOrQuoteState(userId, function(result) {
            if (result.status) {
                //过滤
                var onTime = _.filter(result.data, function(o) {
                    return (o.createdOn > endtime)
                });
                //排序
                var orders = _.sortBy(onTime, 'createdOn').reverse();

                res.json({
                    status: true,
                    data: orders
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: result.err
                });
                res.end();
            }

        });
    },
    //获取历史订单列表[待添加权限]
    getMyOldOrders: function(req, res, done) {
        config.resHead(res);
        var userId = req.userId;
        var starTime = new Date(req.params.starTime);
        var count = req.params.count;

        orderModel.getOrderByUserOrQuoteState(userId, function(result) {
            if (result.status) {
                //过滤
                var onTime = _.filter(result.data, function(o) {
                    return (o.createdOn < starTime)
                });
                //排序
                var orders = _.sortBy(onTime, 'createdOn').reverse();

                res.json({
                    status: true,
                    data: orders.slice(0, count)
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: result.err
                });
                res.end();
            }

        });

    },
    //订单号获取订单信息
    getByOrderName: function(req, res, done) {
        config.resHead(res);

        async.auto({
                //获取订单
                getOrder: function(callback) {
                    orderModel.getByOrderName(req.params.orderName,
                        function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data)
                            } else {
                                callback('getOrderErr', orderResult.err);
                            }

                        });
                },
                //获取采购商
                getPurUser: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    userModel.getByUserId(order.purUserId, function(purUserResult) {
                        if (purUserResult.status) {
                            callback(null, purUserResult.data)
                        } else {
                            callback('getPurUserErr', purUserResult.err);
                        }
                    });

                }],
                //获取供应商
                getSupUser: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    if (order.supUserId) {
                        userModel.getByUserId(order.supUserId, function(supUserResult) {
                            if (supUserResult.status) {
                                callback(null, supUserResult.data)
                            } else {
                                callback('getPurUserErr', supUserResult.err);
                            }
                        });
                    } else {
                        callback(null, null)
                    }
                }],



            },
            function(err, results) {

                if (!err) {
                    var order = results.getOrder;
                    var purchaser = results.getPurUser;
                    var supplier = results.getSupUser;

                    order.purchaser = purchaser;

                    order.supplier = supplier;

                    res.json({
                        status: true,
                        data: order
                    });
                    res.end();
                } else {
                    res.json({
                        status: true,
                        err: err
                    });
                    res.end();

                }
            });




    }
}
