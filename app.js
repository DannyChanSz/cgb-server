var restify = require('restify');
var category = require("./models/category.js");
var doc = require("./models/doc.js");
var upload = require("./models/upload.js");


var ip_addr = '0.0.0.0';
var port = '8082';

var server = restify.createServer({
    name: "dannycms"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());



server.listen(port, ip_addr, function() {
    console.log('%s listening at %s ', server.name, server.url);
});


//路由

var PATH_CATE = '/category'
server.get({path: PATH_CATE,version: '0.0.1'}, category.findAll);
server.get({path: PATH_CATE + '/:id',version: '0.0.1'}, category.find);
server.post({path: PATH_CATE,version: '0.0.1'}, category.postNew);
server.put({path: PATH_CATE,version: '0.0.1'}, category.update);
server.del({path: PATH_CATE + '/:id',version: '0.0.1'}, category.remove);


var PATH_DOC = '/doc'
server.get({path: PATH_DOC,version: '0.0.1'}, doc.findAll);
server.post({path: PATH_DOC,version: '0.0.1'}, doc.postNew);

var PATH_UPLOAD = '/upload'
server.post({path: PATH_UPLOAD+'/image',version: '0.0.1'}, upload.image);

