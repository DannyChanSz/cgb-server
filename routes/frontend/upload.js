var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');

var keywordCtrl = require('../../controllers/frontend/keywordCtrl.js');

/**
 * 关键字路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {

    //===关键字路由===
    var PATH_KEYWORD = '/keywords';
    //获取关键字列表
    server.get({
        path: PATH_KEYWORD + '/getKeywords',
        version: '0.0.1'
    }, jwtauth, keywordCtrl.getKeywords);

    //获取关键字列表
    //keywords:['x','xxx'],
    server.post({
        path: PATH_KEYWORD + '/setKeywords',
        version: '0.0.1'
    }, jwtauth, keywordCtrl.setKeywords);
}
