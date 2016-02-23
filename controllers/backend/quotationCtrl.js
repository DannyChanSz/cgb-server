var async = require("async");


var quotation = require('../../models/context.js').quotation();
var user = require('../../models/context.js').user();

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
                quotation.getQutationsByOrder(orderId, function(result) {
                    callback(null, result);
                })

            },
            getQutationsUserInfo: ['getQutations', function(callback, results) {
                var quoResult = results.getQutations;
                if (quoResult.status) {

                    var quosWithUser = new Array();

                      var quotations = quoResult.data;

                    var q = async.queue(function(quotation, qCallback) {

                        user.getByUserId(quotation.userId, function(userResult) {
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


                } else {
                    callback('getQutationsError', null);
                }

            }]

        }, function(err, results) {
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






}
