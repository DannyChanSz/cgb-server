
var payCtrl = require('../../controllers/frontend/payCtrl.js');

/**
 * 支付路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {

    var PATH_PAY = '/pay';

    //支付客户端回调
    //result中query参数
    server.post({
        path: PATH_PAY + '/clientNotify',
        version: '0.0.1'
    }, payCtrl.clientNotify);

    //支付服务端回调
    server.post({
        path: PATH_PAY + '/serverNotify',
        version: '0.0.1'
    }, payCtrl.serverNotify);
}
