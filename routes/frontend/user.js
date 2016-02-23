var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');

var userCtrl = require('../../controllers/frontend/userCtrl.js');

/**
 * 用户路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {

    ///controller/action/:param1:param2:param3

    var PATH_USER = '/user';
    //检查手机存在
    server.get({
        path: PATH_USER + '/checkPhone/:phone',
        version: '0.0.1'
    }, userCtrl.checkPhone);
    //发送验证码
    //phone
    server.post({
        path: PATH_USER + '/sendPhoneToken',
        version: '0.0.1'
    }, middlewares.tokenMiddle, userCtrl.sendPhoneToken);
    //注册 
    //userType,phone,code,password,userProfile
    server.post({
        path: PATH_USER + '/regist',
        version: '0.0.1'
    }, middlewares.tokenMiddle, userCtrl.regist);
    //登陆
    //phone,password,userType
    server.post({
        path: PATH_USER + '/login',
        version: '0.0.1'
    }, userCtrl.login);

    //获取个资料
    server.get({
        path: PATH_USER + '/getProfile',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, userCtrl.getProfile);
    //修个资料
    //任意自定义参数
    server.post({
        path: PATH_USER + '/changeProfile',
        version: '0.0.1'
    }, jwtauth, userCtrl.changeProfile);
    //修个密码
    //oldPassword,password
    server.post({
        path: PATH_USER + '/changePassword',
        version: '0.0.1'
    }, jwtauth, userCtrl.changePassword);

    //检测验证码
    server.get({
        path: PATH_USER + '/checkPhoneToken/:phone/:code',
        version: '0.0.1'
    }, middlewares.tokenMiddle, userCtrl.checkPhoneToken);

    //重置密码
    //phone,code,password
    server.post({
        path: PATH_USER + '/resetPassword',
        version: '0.0.1'
    }, middlewares.tokenMiddle, userCtrl.resetPassword);
}
