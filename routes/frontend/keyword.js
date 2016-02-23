var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');

var uploadCtrl = require('../../controllers/frontend/uploadCtrl.js');

/**
 * 文件上传路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {


    var PATH_UPLOAD = '/upload'
        //图片上传
        //gallery
    server.post({
        path: PATH_UPLOAD + '/image',
        version: '0.0.1'
    }, uploadCtrl.image);
}
