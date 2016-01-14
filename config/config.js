var mongojs = require("mongojs");
var connection_string = '127.0.0.1:27017/cgbdb';
var dbName = mongojs(connection_string, ['cgbdb']);


module.exports = {
    mongojs: mongojs,
    db: dbName,
    jwtTokenSecret: '123456',
    resHead: function(res) {
        res.charSet('utf8');
    },
    app_info: {
        app_version: '0.0.1',
        app_ios_path: 'http//www.epipe.cn/download/cgb.ipa',
        app_andriod_path: 'http//www.epipe.cn/download/cgb.ipa'
    }


}
