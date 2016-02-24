var _ = require("underscore");


var orderModel = require('../../models/context.js').order();


/**
 * 订单管理
 * @type {Object}
 */
module.exports = {

    /**
     * 订单列表
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findAll: function(req, res, done) {

        orderModel.findAll({}, function(result) {

            if (result.status) {
                result.data = _.sortBy(result.data, 'createdOn').reverse();
            }
            res.json(result);
            res.end();

        })

    },

    /**
     * 修改订单状态（完成/取消）
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    changeState: function(req, res, done) {


        var orderId = req.params.orderId;
        var state = req.params.state;

        if (state == '已完成' || state == '已关闭') {

            async.auto({
                getOrder: function(callback) {
                    orderModel.findById(orderId, function(result) {

                        if (result.status) {
                            callback(null, result.data);
                        } else {
                            callback('getOrder');
                        }

                    })

                },
                checkChangeAuth: ['getOrder', function(callback, results) {

                    var order = results.getOrder;

                    if (state == '已完成' && order.state == '已发货') {
                        callback();
                    } else if (state == '已关闭' && (order.state == '报价' || order.state == '待支付')) {
                        callback();
                    }

                    callback('无权修改该订单');


                }],
                changeOrderState: ['checkChangeAuth', function(callback, results) {

                    var order = results.getOrder;
                    order.state = state;
                    orderModel.updateOrder(order, function(result) {
                        if (result.status) {
                            callback(null, result.data);

                        } else {
                            callback('changeOrderState');
                        }
                    })

                }]

            }, function(err, results) {

                if (!err) {
                    res.json({
                        status: true,
                        data: results.changeOrderState
                    })
                } else {
                    res.json({
                        status: false,
                        errMsg: err
                    });
                    res.end();
                }

            })


        } else {
            res.json({
                status: false,
                errMsg: '不支持该修改操作'
            })
        }


    }






}
