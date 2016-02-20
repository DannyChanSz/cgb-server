var config = require("../config/config.js");
var fs = require('fs');
var async = require('async');
var _ = require("underscore");
var PATH = './public';


module.exports = {

    image: function(req, res, done) {

        config.resHead(res);

        var type = req.files.file.name.split('.');
        var filename = new Date().getTime() + '.' + String(type[type.length - 1]);
        var gallery = req.params.gallery
        var fullPath = PATH + getGalleryDirPath(gallery);

        //console.info('fullPath', fullPath);

        async.series([
            function(callback) {
                //检查目录是否存在
                fs.exists(fullPath, function(exists) {
                    if (!exists) {
                        fs.mkdir(fullPath, 0777, callback);
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
                    fs.exists(fullPath + filename, function(exists) {
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

                fs.rename(req.files.file.path, fullPath + filename, function() {
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

//相册地址映射
var galleryDirs = [{
    gallery: 'avatar',
    dir: '/avatar/'
}, {
    gallery: 'certificate',
    dir: '/certificate/'
}]

//获取相册地址
var getGalleryDirPath = function(gallery) {

    var dir = '/default';
    _.each(galleryDirs, function(gDir) {
    	//console.info(gDir);
        if (gDir.gallery == gallery) {
            dir = gDir.dir;
        }
    })
    return dir;
}
