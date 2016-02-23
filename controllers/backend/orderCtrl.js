var order = require('../../models/context.js').order();


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

        order.findAll({}, function(result) {
            res.json(result);
            res.end();

        })

    }





}
