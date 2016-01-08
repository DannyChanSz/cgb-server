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
    addProfile: function(userId, profile, done) {

        var entity = profile;
        entity.userId = config.mongojs.ObjectId(userId);

        entities.save(entity, function(err, success) {
            return done({
                status: success,
                err: err
            });
        });
    },
    /**
     * 获取用户资料信息
     * @param {[type]}   userId [description]
     * @param {Function} done   [description]
     */
    getProfileByUser: function(userId, done) {

        var objUserId = config.mongojs.ObjectId(userId);

        entities.findOne({
            userId: objUserId
        }, function(err, success) {
            if (success) {
                done({
                    status: true,
                    data: success
                });
            } else {
                done({
                    status: false,
                    data: err
                });
            }
        });
    },
    /**
     * 更新用户资料
     * @param {[type]}   userId  [description]
     * @param {[type]}   profile [自定义资料参数]
     * @param {Function} done    [description]
     */
    updateProfileByUser: function(userId, profile, done) {

        var objUserId = config.mongojs.ObjectId(userId);
        profile.userId = objUserId;

        entities.update({ 
            userId: objUserId
        }, {
            $set: profile
        }, function(err, success) {
            if (success) {
                done({
                    status: true,
                    data: success
                });
            } else {
                done({
                    status: false,
                    err: err
                });
            }

        });
    }





}
