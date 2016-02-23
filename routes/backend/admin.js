var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');


var adminCtrl = require('../../controllers/backend/adminCtrl.js');





module.exports = function(server) {


    var PATH = '/backend/admin';

    server.get({
        path: PATH + '/findAll',
        version: '0.0.1'
    }, adminCtrl.findAll);


    // server.get({
    //     path: PATH + '/findOne/:id',
    //     version: '0.0.1'
    // }, adminCtrl.findOne);


    // server.post({
    //     path: PATH + '/create',
    //     version: '0.0.1'
    // }, adminCtrl.create);


    // server.post({
    //     path: PATH + '/update/:id',
    //     version: '0.0.1'
    // }, adminCtrl.update);


    // server.post({
    //     path: PATH + '/remove/:id',
    //     version: '0.0.1'
    // }, adminCtrl.remove);



}
