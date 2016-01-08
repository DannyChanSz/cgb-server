var config = require("../config/config.js");
var crypto = require('crypto');
var strHelper = require("../tools/stringHelper.js");


/**
 *  用户
 *  id,userName,phone,userType,hashPassword,isLockout
 */
var user = config.db.collection("user");



module.exports = {

    /**
     * 检测手机注册状态
     * @param  {[type]}   phone [手机号]
     * @param  {Function} done  [回调]
     * @return {[type]}         [是否存在]
     */
    checkPhone: function(phone, done) {
        user.findOne({
            phone: phone
        }, function(err, success) {
            if (success) {
                done(true)
            } else {
                done(false);
            }
        });
    },

    /**
     * 注册
     * @param  {[type]}   phone       [description]
     * @param  {[type]}   password    [description]
     * @param  {[type]}   userType    [description]
     * @param  {[type]}   confirmCode [description]
     * @param  {Function} done        [description]
     * @return {[type]}               [成功失败]
     */
    regist: function(phone, password, userType, done) {


        var userName = generateUserName();
        var passwordSha = getHashPassword(password);
        var entity = {
            userName: userName,
            phone: phone,
            userType: userType,
            hashPassword: passwordSha,
            isLockout: false

        }
        user.save(entity, function(err, success) {
            if (success) {
                return done({
                    status: true,
                    data: success
                });
            } else {
                return done({
                    status: false,
                    err: err
                });
            }

        });


    },
    /**
     * 登陆
     * @param  {[type]}   phone    [description]
     * @param  {[type]}   password [description]
     * @param  {[type]}   userType [description]
     * @param  {Function} done     [description]
     * @return {[type]}            [成功失败]
     */
    login: function(phone, password, userType, done) {


        var searchEntity = {
            phone: phone,
            hashPassword: getHashPassword(password),
            userType: userType
        };
        //console.info('searchEntity',searchEntity);
        user.findOne(searchEntity, function(err, success) {
            if (success) {
                done({
                    success: true,
                    data: success
                });
            } else {
                done({
                    success: false,
                    data: err
                });
            }
        });

    }




};

//生成用户名
var generateUserName = function() {

    var userName = strHelper.generateNumCode(10);
    user.findOne({
        userName: userName
    }, function(err, success) {
        if (success) {
            return generateUserName()
        } else {
            return userName;
        }
    });
}

//生成加密密码
var getHashPassword = function(password) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var passwordSha = sha1.digest('hex');
    return passwordSha;
}
