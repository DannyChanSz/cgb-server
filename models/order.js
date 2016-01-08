var config = require("../config/config.js");
var strHelper = require("../tools/stringHelper.js");


/**
 * 订单
 * id,name,productName,productAmount,productUnit,shipAddress,state,purUserId,supUserId,createdOn
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
     * 获取自身订单及报价中订单
     * @param  {[type]}   userId [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    getOrderByUserOrQuoteState: function(userId, done) {
        var objUserId = config.mongojs.ObjectId(userId);
        entities.find({
            '$or': [{
                purUserId: objUserId
            }, {
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

    }




}
