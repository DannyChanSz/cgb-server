var mongojs = require("mongojs");
var connection_string = '127.0.0.1:27017/cgbdb';
var dbName = mongojs(connection_string, ['cgbdb']);


var db = {
    mongojs: mongojs,
    db: dbName,
    resHead: function(res) {        
        res.charSet('utf8');
    }

}

module.exports = db;
