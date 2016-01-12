var config = require("../config/config.js");
var strHelper = require("../tools/stringHelper.js");


/**
 * 订单
 * id,name,productName,productAmount,productUnit,unitPrice,sumPrice,shipAddress,state,purUserId,supUserId,createdOn
 * name:订单编号,state:状态（报价 待支付 已支付 已发货 已完成 已关闭）
 */
var entities = config.db.collection("order");




module.exports = {

    /**
     * 添加订单
     * @param {[type]} order   [商品名称]
     * @param {[type]} purUserId        [所属用户编号]
     */
    addOrder: function(order, done) {

        order.name = strHelper.generateOrderName();
        order.purUserId = config.mongojs.ObjectId(order.purUserId);
        order.state = '报价';
        order.createdOn = new Date();

        entities.save(order, function(err, success) {
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

        });

    },
    /**
     * 更新订单
     * @param  {[type]}   order [订单实体]
     * @param  {Function} done  [description]
     * @return {[type]}         [description]
     */
    updateOrder: function(order, done) {
        order._id = config.mongojs.ObjectId(order._id);
        order.purUserId = config.mongojs.ObjectId(order.purUserId);
        order.supUserId = config.mongojs.ObjectId(order.supUserId);


        entities.update({
            _id: order._id
        }, {
            $set: order
        }, function(err, upSuccess) {
            if (upSuccess) {
                done({
                    status: true,
                    data: upSuccess
                });
            } else {
                done({
                    status: false,
                    err: '更新失败'
                });
            }

        })




    },

    /**
     * 获取供应商订单或报价订单
     * @param  {[type]}   userId [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    getOrderBySupUserId: function(userId, done) {
        var objUserId = config.mongojs.ObjectId(userId);
        entities.find({
            '$or': [{
                supUserId: objUserId
            }, {
                state: '报价'
            }]
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
        });

    },
    /**
     * 获取采购商订单
     * @param  {[type]}   userId [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    getOrderByPurUserId: function(userId, done) {
        var objUserId = config.mongojs.ObjectId(userId);
        entities.find({
            purUserId: objUserId
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
        });
    },


    /**
     * 订单号获取订单
     * @param  {[type]}   orderName [description]
     * @param  {Function} done      [description]
     * @return {[type]}             [description]
     */
    getByOrderName: function(orderName, done) {
        entities.findOne({
            name: orderName
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
        });
    }



}
