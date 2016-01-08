var restify = require('restify');
var supplier = require("./models/supplier.js");
var category = require("./models/category.js");
var doc = require("./models/doc.js");
var upload = require("./models/upload.js");
var login = require("./models/login.js");
var register = require("./models/register.js");
var jwt = require('jwt-simple')
var moment = require('moment');
var jwtauth = require('./models/jwtauth.js');

//new
//public
var tokenContainer = new Array();
var tokenMiddle = function(req, res, done) {
    req.params.tokens = tokenContainer;
    done();
}
var phoneTokens = require('./models/phoneTokens.js');
phoneTokens.checkTokenTimeoutStar(tokenContainer);//检查过期服务

//private
var userCtrl = require('./controllers/userCtrl.js');
var orderCtrl = require('./controllers/orderCtrl.js');
var keywordCtrl= require('./controllers/keywordCtrl.js');

var ip_addr = '0.0.0.0';
var port = '8083';

var server = restify.createServer({
    name: "cgb-server"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('x-access-token');
server.use(restify.CORS());
server.use(restify.fullResponse());

server.listen(port, ip_addr, function() {
    console.log('%s listening at %s ', server.name, server.url);
});


//路由

//====用户路由====

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
}, tokenMiddle, userCtrl.sendPhoneToken);
//注册 
//userType,phone,code,password,userProfile
server.post({
    path: PATH_USER + '/regist',
    version: '0.0.1'
}, tokenMiddle, userCtrl.regist);
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
}, jwtauth,userCtrl.getProfile);
//修个资料
//任意自定义参数
server.post({
    path: PATH_USER + '/changeProfile',
    version: '0.0.1'
}, jwtauth,userCtrl.changeProfile);
//修个密码
//oldPassword,newPassword
server.post({
    path: PATH_USER + '/changeProfile',
    version: '0.0.1'
}, jwtauth,userCtrl.changePassword);


//====订单路由====
var PATH_ORDER = '/order';

//添加订单(登陆权限)
//productName,productAmount,productUnit,shipAddress
server.post({
    path: PATH_ORDER + '/createOrder',
    version: '0.0.1'
}, jwtauth,orderCtrl.addOrder);

//获取新自身订单及其他报价状态订单(登陆权限)
server.get({
    path: PATH_ORDER + '/getMyNewOrders/:endTime',
    version: '0.0.1'
}, jwtauth,orderCtrl.getMyNewOrders);

//获取历史自身订单及其他报价状态订单(登陆权限)
server.get({
    path: PATH_ORDER + '/getMyOldOrders/:starTime/:count',
    version: '0.0.1'
}, jwtauth,orderCtrl.getMyOldOrders);

//===关键字路由===
var PATH_KEYWORD = '/keywords';
//获取关键字列表
server.get({
    path: PATH_KEYWORD + '/getKeywords',
    version: '0.0.1'
}, jwtauth,keywordCtrl.getKeywords);

//获取关键字列表
//keywords:['x','xxx'],
server.post({
    path: PATH_KEYWORD + '/setKeywords',
    version: '0.0.1'
}, jwtauth,keywordCtrl.setKeywords);












