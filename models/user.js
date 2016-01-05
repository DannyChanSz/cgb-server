var config = require("../config/config.js");
var crypto = require('crypto');


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
     * 发送手机验证码
     * @param  {[type]}   phone [description]
     * @param  {Function} done  [description]
     * @return {[type]}         [无]
     */
    // sendPhoneConfirmCode: function(phone, done) {

    // },
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
        user.save(entity, function(err, success) {
            return done({
                success: success,
                err: err
            });
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

    }

};
