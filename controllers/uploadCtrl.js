var config = require("../config/config.js");
var fs = require('fs');
var async = require('async');

var PATH = './public/uploaded/';

module.exports = {

    image: function(req, res, done) {

        config.resHead(res);

        var type = req.files.file.name.split('.');
        var filename = new Date().getTime() + '.' + String(type[type.length - 1]);

        async.series([
            function(callback) {
                //检查目录是否存在
                fs.exists(PATH, function(exists) {
                    if (!exists) {
                        fs.mkdir(PATH, 0777, callback);
                    } else {
                        callback();
                    }
                });
            },
            function(callback) {
                //检查文件是否已经存在
                var isNotExist = true;
                async.whilst(function() {
                    //console.log('test');
                    return isNotExist;

                }, function(cb) {
                    //console.log('rename!');
                    fs.exists(PATH + filename, function(exists) {
                        isNotExist = exists;
                        if (exists) {
                            filename = new Date().getTime() + '.' + String(type[type.length - 1]);
                        }
                        cb();

                    })

                }, function(err) {

                    callback();

                })

            },
            function(callback) {

                fs.rename(req.files.file.path, PATH + filename, function() {
                    callback();
                });
            }
        ], function(err, values) {

            if (!err) {
                res.json({
                    status: true,
                    data: {
                        fileName: filename
                    }
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: err
                });
                res.end();
            }

        });

    }



}
