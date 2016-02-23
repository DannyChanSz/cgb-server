var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var userCtrl = require('../../controllers/backend/userCtrl.js');





module.exports = function(server) {


    var PATH = '/backend/user';

    /**
     * 会员列表
     */
    server.get({
        path: PATH + '/findAll',
        version: '0.0.1'
    }, userCtrl.findAll);

    /**
     * 会员详情
     */
    server.get({
        path: PATH + '/getById/:id',
        version: '0.0.1'
    }, userCtrl.getById);

    /**
     * 修改审核状态
     * id,ifAuditPass
     */
    server.post({
        path: PATH + '/changeAudit',
        version: '0.0.1'
    }, userCtrl.changeAudit);

}
