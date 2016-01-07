var config = require("../config/config.js");
var userProfile = config.db.collection("userProfile");

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
    AddProfile: function(userId, profile) {

        var entity = profile;
        entity.userId = userId;

        user.save(entity, function(err, success) {
            return done({
                success: success,
                err: err
            });
        });
    }





}
