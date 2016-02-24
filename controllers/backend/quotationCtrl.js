var async = require("async");
var _ = require("underscore");

var quotationModel = require('../../models/context.js').quotation();
var userModel = require('../../models/context.js').user();
var orderModel = require('../../models/context.js').order();

var MAX_QUEUE_COUNT = 5;

/**
 * 订单管理
 * @type {Object}
 */
module.exports = {

    /**
     * 订单报价管理
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findByOrderId: function(req, res, done) {
        var orderId = req.params.orderId;


        async.auto({
                getQutations: function(callback) {
                    quotationModel.getQutationsByOrder(orderId, function(result) {

                        if (result.status) {
                 
                            var quotations = _.sortBy(result.data, 'createdOn').reverse();
                            callback(null, quotations);
                        } else {
                            callback('getQutations');
                        }

                    })
                },
                getQutationsUserInfo: ['getQutations', function(callback, results) {
    
                        var quosWithUser = new Array();

                        var quotations = results.getQutations;

                        var q = async.queue(function(quotation, qCallback) {

                            userModel.getByUserId(quotation.userId, function(userResult) {
                                if (userResult.status) {
                                    quotation.user = userResult.data;
                                    qCallback(null, quotation)
                                } else {

                                    qCallback(null, quotation)
                                }
                            });

                        }, MAX_QUEUE_COUNT);

                        q.push(quotations, function(err, quotation) {

                            quosWithUser.push(quotation);

                        });


                        q.drain = function() {

                            callback(null, quosWithUser);
                        }


                }]

            },
            function(err, results) {
                if (!err) {
                    res.json({
                        status: true,
                        data: results.getQutationsUserInfo
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: '无报价单'
                    });
                    res.end();
                }
            })
    },

    /**
     * 关闭供应商报价
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    removeById: function(req, res, done) {


        var quotationId = req.params.quotationId;
        //条件：报价状态


        async.auto({
            getQutation: function(callback) {
                quotationModel.getQuotationById(quotationId, function(result) {

                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('getQutation')
                    }

                })

            },
            checkRemoveAuth: ['getQutation', function(callback, results) {
                var orderId = results.getQutation.orderId;
                orderModel.findById(orderId, function(result) {
                    if (result.status) {
                        var order = result.data;

                        if (order.state == '报价') {
                            callback(null, result.data);
                        } else {
                            callback('无权删除该报价')
                        }

                    } else {
                        callback('getQutation')
                    }
                })

            }],
            reomveQutation: ['checkRemoveAuth', function(callback, results) {
                quotationModel.removeById(quotationId, function(result) {

                    if (result.status) {
                        callback(null, result.data);
                    } else {
                        callback('reomveQutation')
                    }
                })

            }]

        }, function(err, results) {

            if (!err) {
                res.json({
                    status: true,
                    data: results.reomveQutation
                })
            } else {
                res.json({
                    status: false,
                    errMsg: err
                });
                res.end();
            }


        })
    }



}
