var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var orderCtrl = require('../../controllers/backend/orderCtrl.js');

var quotationCtrl = require('../../controllers/backend/quotationCtrl.js');



module.exports = function(server) {


    var PATH = '/backend/order';

    server.get({
        path: PATH + '/findAll',
        version: '0.0.1'
    }, orderCtrl.findAll);

    server.get({
        path: PATH + '/getQuotations/:orderId',
        version: '0.0.1'
    }, quotationCtrl.findByOrderId);



}