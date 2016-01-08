var config = require("../config/config.js");
var entities = config.db.collection("userProfile");

/**
 *  用户信息
 *  id,companyName,userId(user)
 */
module.exports = {

    /**
     * 添加用户信息信息
     * @param {[type]} userId      [所属user编号]
     * @param {[type]} companyName [description]
     */
    AddProfile: function(userId, profile, done) {

        var entity = profile;
        entity.userId = config.mongojs.ObjectId(userId);

        entities.save(entity, function(err, success) {
            return done({
                success: success,
                err: err
            });
        });
    },
    /**
     * 获取用户资料信息
     * @param {[type]}   userId [description]
     * @param {Function} done   [description]
     */
    GetProfileByUser: function(userId, done) {

        var objUserId = config.mongojs.ObjectId(userId);
console.log('objUserId',objUserId,typeof(objUserId))
        entities.findOne({
            userId: objUserId
        }, function(err, success) {
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





}
