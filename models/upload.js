var fs = require('fs');
var async = require('async');




var PATH = './uploaded/';

module.exports = {

    image: function image(req, res, next) {

        console.log("Uploading file...");
        var type = req.files.file.name.split('.');
        var rd = parseInt(Math.random() * 100);
        var filename = new Date().getTime() + '.' + String(type[type.length - 1]);
        console.log("orgfile:" + req.files.file.name + " | newfile:" + filename);


        async.series([
            function(cb) {
                //检查目录是否存在
                fs.exists(PATH, function(exists) {
                    if (!exists) {
                        fs.mkdir(PATH, 0777, cb);
                    } else {
                        cb();
                    }
                });
            },
            function(cb) {
                //检查文件是否已经存在
                fs.exists(PATH + filename, function(exists) {
                    if (exists) {
                        filename = new Date().getTime() + '.' + String(type[type.length - 1]);
                    }
                    cb();
                })
            },
            function(cb) {

                fs.rename(req.files.file.path, PATH + filename, function() {
                    cb();
                });
            }
        ], function(err, values) {

                res.send(201, {
                    message: 'File transfer completed',
                    filename: filename
                });
                console.log('done');

        });


        /*fs.exists(PATH, function(exists) {
            if (!exists) {
                fs.mkdir(PATH, 0777, copyfile);
            } else {
                copyfile();
            }
        });

        function copyfile() {



            fs.rename(req.files.file.path, PATH + filename, function() {

                res.send(201, {
                    message: 'File transfer completed',
                    filename: filename
                });
                console.log('done');
            });
        }*/









    }

}
