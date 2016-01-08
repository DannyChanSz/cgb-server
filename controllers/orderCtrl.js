var config = require("../config/config.js");
var orderModel = require("../models/order.js");
var _ = require("underscore");

module.exports = {

    //添加订单
    addOrder: function(req, res, done) {

        config.resHead(res);

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

    },
    //获取订单列表
    getMyNewOrders: function(req, res, done) {

        config.resHead(res);
        var userId = req.userId;
        var endtime = new Date(req.params.endTime);

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
    //获取历史订单列表
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
                    data: orders.slice(0,count)
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

    }



}
