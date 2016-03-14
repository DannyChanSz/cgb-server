// var _ = require("underscore");
var crypto = require('crypto');

module.exports = {

    defaultCall: function(err, success, done) {
        if (success) {
            return done({
                status: true,
                data: success
            });
        } else {
            return done({
                status: false,
                errMsg: err
            });
        }
    },
    //生成加密密码
    getHashPassword: function(password) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(password);
        var passwordSha = sha1.digest('hex');
        return passwordSha;
    }
}
