'use strict';

var restify = require('restify');

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

server.listen(port, ip_addr, function() {
    console.log('%s listening at %s ', server.name, server.url);
});


//路由
require('./routes/index.js')(server, restify, __dirname);
