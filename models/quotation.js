var config = require("../config/config.js");
var async = require("async");
/**
 * 报价单
 * _id,unitPrice,sumPrice,userId(报价人),orderId(报价订单),createdOn
 */
var entities = config.db.collection("quotation");



module.exports = {

    /**
     * 获取报价单
     * @param  {[type]}   quotationId [description]
     * @param  {Function} done        [description]
     * @return {[type]}               [description]
     */
    getQuotationById: function(quotationId, done) {
        var objQuotationId = config.mongojs.ObjectId(quotationId);

        entities.findOne({
            _id: objQuotationId
        }, function(err, success) {

            if (success) {
                return done({
                    status: true,
                    data: success
                });
            } else {
                return done({
                    status: false,
                    err: err
                });
            }

        })

    },

    /**
     * 添加报价单
     * @param {[type]}   unitPrice [单价]
     * @param {[type]}   sumPrice  [总价]
     * @param {[type]}   userId    [所属用户]
     * @param {[type]}   orderId   [所报订单]
     * @param {Function} done      [description]
     */
    setQuotation: function(unitPrice, sumPrice, userId, orderId, done) {

        var objUserId = config.mongojs.ObjectId(userId);
        var objOrderId = config.mongojs.ObjectId(orderId);

        async.auto({
            getMyQuotation: function(callback) {
                entities.findOne({
                    userId: objUserId,
                    orderId: objOrderId
                }, function(err, success) {
                    callback(null, success);
                })

            },
            setQuotation: ['getMyQuotation', function(callback, results) {

                if (results.getMyQuotation) {
                    //已报价
                    var entity = results.getMyQuotation;
                    entity.unitPrice = unitPrice;
                    entity.sumPrice = sumPrice;
                    entity.createdOn = new Date();

                    entities.update({ //更新密码
                        _id: entity._id
                    }, {
                        $set: entity
                    }, function(upErr, upSuccess) {
                        if (upSuccess) {
                            callback(null, upSuccess);
                        } else {
                            callback('getMyQuotation-update', null);
                        }

                    });

                } else {
                    //未报价
                    var entity = {
                        unitPrice: unitPrice,
                        sumPrice: sumPrice,
                        userId: objUserId,
                        orderId: objOrderId,
                        createdOn: new Date()
                    }

                    entities.save(entity, function(err, success) {
                        if (success) {
                            callback(null, success);
                        } else {
                            callback('getMyQuotation-add', null);
                        }
                    })

                }

            }]
        }, function(err, results) {

            if (!err) {
                done({
                    status: true,
                    data: results.setQuotation
                });
            } else {
                done({
                    status: false,
                    err: err
                });
            }
        })

    },

    /**
     * 订单及用户获取报价单列表
     * @param  {[type]}   userId  [description]
     * @param  {[type]}   orderId [description]
     * @param  {Function} done    [description]
     * @return {[type]}           [description]
     */
    getQuotationsByUserAndOrder: function(userId, orderId, done) {


        var objUserId = config.mongojs.ObjectId(userId);
        var objOrderId = config.mongojs.ObjectId(orderId);

        entities.findOne({
            userId: objUserId,
            orderId: objOrderId
        }, function(err, success) {
            if (success) {
                return done({
                    status: true,
                    data: success
                });
            } else {
                return done({
                    status: false,
                    err: err
                });
            }
        })
    },
    /**
     * 订单下的报价单列表
     * @param  {[type]}   orderId [description]
     * @param  {Function} done    [description]
     * @return {[type]}           [description]
     */
    getQutationsByOrder: function(orderId, done) {

        var objOrderId = config.mongojs.ObjectId(orderId);

        entities.find({
            orderId: objOrderId
        }, function(err, success) {
            if (success) {
                return done({
                    status: true,
                    data: success
                });
            } else {
                return done({
                    status: false,
                    err: err
                });
            }
        })
    }




}
