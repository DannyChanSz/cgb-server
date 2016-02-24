var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var orderCtrl = require('../../controllers/backend/orderCtrl.js');

var quotationCtrl = require('../../controllers/backend/quotationCtrl.js');



module.exports = function(server) {


    var PATH = '/backend/order';

    /**
     * 获取所有订单
     */
    server.get({
        path: PATH + '/findOrders',
        version: '0.0.1'
    }, orderCtrl.findAll);

    /**
     * 修改订单状态（修改条件：已发货->已完成 或 报价/待支付->已关闭）
     * orderId,state
     */
    server.post({
        path: PATH + '/changeOrderState',
        version: '0.0.1'
    }, orderCtrl.changeState);



    /**
     * 获取订单所有报价
     */
    server.get({
        path: PATH + '/getQuotations/:orderId',
        version: '0.0.1'
    }, quotationCtrl.findByOrderId);

    /**
     * 删除报价(仅允许删除报价状态的报价单)
     * quotationId
     */
    server.post({
        path: PATH + '/removeQuotation',
        version: '0.0.1'
    }, quotationCtrl.removeById);





}
