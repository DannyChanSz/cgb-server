var async = require("async");
var orderModel = require("../../models/order.js");
/**
 * 支付
 * @type {Object}
 */
module.exports = {

    /**
     * 客户端回调
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    clientNotify: function(req, res, done) {

        var orderName = req.params.out_trade_no.replace(/"/g, '');

        clientSignVerify(req);

        //签名验证
        if (true) {

            async.auto({
                getOrder: function(callback) {
                    orderModel.getByOrderName(orderName, function(result) {

                        if (result.status) {
                            callback(null, result.data);
                        } else {
                            callback('订单不存在');
                        }

                    })
                },
                changeOrderState: ['getOrder', function(callback, results) {

                    var order = results.getOrder;
                    if (order.state == '待支付') {
                        order.state = '已支付';
                        orderModel.updateOrder(order, function(result) {
                            if (result.status) {
                                callback(null, result.data);

                            } else {
                                callback('changeOrderState');
                            }
                        })
                    } else {
                        callback('订单已支付');
                    }


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
                errMsg: '签名验证失败'
            });
            res.end();

        }

    },
    /**
     * 服务器回调
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    serverNotify: function(req, res, done) {
        res.end();
    }


}

/**
 * 客户端签名验证
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
var clientSignVerify = function(request) {
    console.log(request._url.query);
}
