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
var PATH_TEST = '/user';
//检查手机存在
server.get({
    path: PATH_TEST + '/checkPhone/:phone',
    version: '0.0.1'
}, userCtrl.checkPhone);
//发送验证码
server.post({
    path: PATH_TEST + '/sendPhoneToken/:phone',
    version: '0.0.1'
}, tokenMiddle, userCtrl.sendPhoneToken);
//注册 
server.post({
    path: PATH_TEST + '/regist/:userType/:phone/:code/:password/:userProfile',
    version: '0.0.1'
}, tokenMiddle, userCtrl.regist);
//登陆
server.post({
    path: PATH_TEST + '/login/:phone/:password/:userType',
    version: '0.0.1'
}, userCtrl.login);

// //路由
// var PATH_LOGIN = '/login';

// server.post({
//     path: PATH_LOGIN,
//     version: '0.0.1'
// }, login.supplierEmailLogin);






// var PATH_REGISTER = '/register/supplier'
// server.get({
//     path: PATH_REGISTER + '/checkemail/:email',
//     version: '0.0.1'
// }, register.supplierCheckEmail);

// server.post({
//     path: PATH_REGISTER,
//     version: '0.0.1'
// }, supplier.postNew);
