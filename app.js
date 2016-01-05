var restify = require('restify');
var registerSupplier = require("./models/register-supplier.js");
var supplier = require("./models/supplier.js");
var category = require("./models/category.js");
var doc = require("./models/doc.js");
var upload = require("./models/upload.js");
var login=require("./models/login.js");
var register=require("./models/register.js");
var jwt = require('jwt-simple')
var moment = require('moment');
var jwtauth = require('./models/jwtauth.js');

// //sms test
// var sms = require("./plugin/sms/sms.js");
// sms.smsSend('13510271102','注册验证','272810',function(res){
//     console.log('success');
// });


var ip_addr = '0.0.0.0';
var port = '8083';

var server = restify.createServer({
    name: "cgb-server"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
restify.CORS.ALLOW_HEADERS.push('x-access-token');
server.use(restify.CORS());






server.listen(port, ip_addr, function() {
    console.log('%s listening at %s ', server.name, server.url);
});


//路由
var PATH_LOGIN = '/login';

server.post({path: PATH_LOGIN,version: '0.0.1'}, login.supplierEmailLogin);






var PATH_REGISTER = '/register/supplier'
server.get({
    path: PATH_REGISTER + '/checkemail/:email',
    version: '0.0.1'
}, register.supplierCheckEmail);

server.post({
    path: PATH_REGISTER,
    version: '0.0.1'
}, supplier.postNew);


var PATH_CATE = '/category'
server.get({
    path: PATH_CATE,
    version: '0.0.1'
}, category.findAll);
server.get({
    path: PATH_CATE + '/:id',
    version: '0.0.1'
}, category.find);
server.post({
    path: PATH_CATE,
    version: '0.0.1'
}, category.postNew);
server.put({
    path: PATH_CATE,
    version: '0.0.1'
}, category.update);
server.del({
    path: PATH_CATE + '/:id',
    version: '0.0.1'
}, category.remove);


var PATH_DOC = '/doc'
server.get({
    path: PATH_DOC,
    version: '0.0.1'
}, doc.findAll);
server.post({
    path: PATH_DOC,
    version: '0.0.1'
}, doc.postNew);

var PATH_UPLOAD = '/upload'
server.post({
    path: PATH_UPLOAD + '/image',
    version: '0.0.1'
}, upload.image);
