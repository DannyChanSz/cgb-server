var config = require("../config/config.js");


var help = require('./help.js');
var _ = require("underscore");

var role = config.db.collection("role");

/**
 * 角色管理
 * id,name,inferfaceList
 */
module.exports = {

    /**
     * 角色检查
     * @param  {[type]}   name [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    checkName: function(name, done) {
        // body...
        role.findOne({ name: name }, _.partial(help.defaultCall, _, _, done));

    },
    /**
     * 角色接口权限
     * @param {[type]}   id            [description]
     * @param {[type]}   inferfaceList [description]
     * @param {Function} done          [description]
     */
    setInterfaceList: function(id, inferfaceList, done) {

        var entity = {
            inferfaceList: inferfaceList
        };

        role.update({
            _id: config.mongojs.ObjectId(id)
        }, {
            $set: entity
        }, _.partial(help.defaultCall, _, _, done));

    }












}
