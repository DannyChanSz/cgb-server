var config = require("../config/config.js");



/**
 * [entities description]
 * _id,info,orderId,createdOn
 */
var entities = config.db.collection("logistics");



module.exports = {
    /**
     * 添加物流信息
     * @param {[type]}   orderId [description]
     * @param {[type]}   info    [description]
     * @param {Function} done    [description]
     */
    addLogistics: function(orderId, info, done) {

        var logistics = {
            info: info,
            orderId: config.mongojs.ObjectId(orderId),
            createdOn: new Date()
        }

        entities.save(logistics, function(err, success) {
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
     * 获取物流列表
     * @param  {[type]}   orderId [description]
     * @param  {Function} done    [description]
     * @return {[type]}           [description]
     */
    getLogistics: function(orderId, done) {
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

        });

    }




}
