var config = require("../config/config.js");
//var strHelper = require("../tools/stringHelper.js");


/**
 * 关键字
 * id,userId,keywords
 */
var entities = config.db.collection("keyword");

module.exports = {

    /**
     * 获取用户关键字
     * @param  {[type]}   userId [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    getkeywordsByUser: function(userId, done) {
        var objUserId = config.mongojs.ObjectId(userId);
        entities.findOne({
            userId: objUserId
        }, function(err, success) {
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
     * 添加用户关键字
     * @param {[type]}   userId   [description]
     * @param {[type]}   keywords [关键字内容数组]
     * @param {Function} done     [description]
     */
    addUserKeywords: function(userId, keywords, done) {
        var objUserId = config.mongojs.ObjectId(userId);
        var entity = {
            userId: objUserId,
            keywords: keywords
        };
        entities.save(entity, function(err, success) {
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
     * 添加用户关键字
     * @param {[type]}   keywordId   [description]
     * @param {[type]}   keywords [关键字内容数组]
     * @param {Function} done     [description]
     */
    updateUserKeywords: function(keywordId, userId, keywords, done) {
        var objKeywordId = config.mongojs.ObjectId(keywordId);
        var objUserId = config.mongojs.ObjectId(userId);
        var entity = {
            userId: objUserId,
            keywords: keywords
        };

        entities.update({
            _id: objKeywordId
        }, {
            $set: entity
        }, function(err, success) {
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



    }



}
