var restify = require('restify');

var jwt = require('jwt-simple')
var moment = require('moment');
var jwtauth = require('./models/jwtauth.js');
var config = require('./config/config.js');
//new
//public
var middlewares = require('./middleware/middlewares.js');


//private
var userCtrl = require('./controllers/userCtrl.js');
var orderCtrl = require('./controllers/orderCtrl.js');
var keywordCtrl = require('./controllers/keywordCtrl.js');
var uploadCtrl = require('./controllers/uploadCtrl.js');

var ip_addr = '0.0.0.0';
var port = '8083';

var server = restify.createServer({
    name: "cgb-server"
});


server.use(restify.queryParser());
// server.pre(restify.pre.sanitizePath());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('x-access-token');
restify.CORS.ALLOW_HEADERS.push('x-app-version');
server.use(restify.CORS());
server.use(restify.fullResponse());


//公共资源访问
server.get(/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));

//版本检测
server.use(function(req, res, next) {

    var app_version = req.headers['x-app-version'];
    //console.log(app_version, config.app_info.app_version, app_version == config.app_info.app_version)
    if (app_version == config.app_info.app_version) {
        next();
    } else {
        res.statusCode = 403;
        res.json(config.app_info);
        res.end();
    }

})



server.listen(port, ip_addr, function() {
    console.log('%s listening at %s ', server.name, server.url);
});


//路由

//====用户路由====
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
},  middlewares.tokenMiddle, userCtrl.checkPhoneToken);

//重置密码
//phone,code,password
server.post({
    path: PATH_USER + '/resetPassword',
    version: '0.0.1'
},  middlewares.tokenMiddle, userCtrl.resetPassword);




//====订单路由====
var PATH_ORDER = '/order';

//添加订单(登陆权限)
//productName,productAmount,productUnit,shipAddress
server.post({
    path: PATH_ORDER + '/createOrder',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.addOrder);



//获取新自身订单及其他报价状态订单(登陆权限)
//oldCount:当前页面记录条数  oldMaxCount:最近一次请求返回的所有记录总数
server.get({
    path: PATH_ORDER + '/getMyNewOrders/:oldCount/:oldMaxCount',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getMyNewOrders);

server.get({
    path: PATH_ORDER + '/getMyNewOrders/:oldCount/:oldMaxCount/:orderState',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getMyNewOrders);


//获取历史自身订单及其他报价状态订单(登陆权限)
//count：要请求的数量 oldCount:当前页面记录条数 oldMaxCount:最近一次请求返回的所有记录总数
server.get({
    path: PATH_ORDER + '/getMyOldOrders/:count/:oldCount/:oldMaxCount',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getMyOldOrders);

server.get({
    path: PATH_ORDER + '/getMyOldOrders/:count/:oldCount/:oldMaxCount/:orderState',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getMyOldOrders);


//获取订单信息
server.get({
    path: PATH_ORDER + '/getByOrderName/:orderName',
    version: '0.0.1'
}, jwtauth, orderCtrl.getByOrderName);

//添加报价单
//unitPrice,sumPrice,orderName
server.post({
    path: PATH_ORDER + '/setQuotation',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.setQuotation);

//获取供应商本人报价单
server.get({
    path: PATH_ORDER + '/getSupQuotation/:orderName',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getSupQuotation);

//获取采购商订单的报价单列表
//pageIndex:页码 count:请求数量
server.get({
    path: PATH_ORDER + '/getPurQuotations/:orderName/:pageIndex/:count',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, orderCtrl.getPurQuotations);

//选择订单报价
//orderName,quotationId
server.post({
    path: PATH_ORDER + '/chooseOrderQuotation',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.chooseOrderQuotation);

//发货
//orderName
server.post({
    path: PATH_ORDER + '/sendGoods',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.sendGoods);

//获取订单物流列表
server.get({
    path: PATH_ORDER + '/getLogistics/:orderName',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.getLogistics);

//添加物流信息
//orderName,info
server.post({
    path: PATH_ORDER + '/addLogistics',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.addLogistics);

//完成订单
//orderName
server.post({
    path: PATH_ORDER + '/finshOrder',
    version: '0.0.1'
}, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.finshOrder);




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


//===文件上传路由===
var PATH_UPLOAD = '/upload'
    //图片上传
    //gallery
server.post({
    path: PATH_UPLOAD + '/image',
    version: '0.0.1'
}, uploadCtrl.image);
