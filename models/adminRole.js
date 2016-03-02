var config = require("../config/config.js");


var help = require('./help.js');
var _ = require("underscore");

var adminRole = config.db.collection("adminRole");

/**
 * 权限（管理员角色对映关系）
 * id,adminId,roleId
 */
module.exports = {

	/**
	 * 添加
	 * @param  {[type]}   adminId [description]
	 * @param  {[type]}   roleId  [description]
	 * @param  {Function} done    [description]
	 * @return {[type]}           [description]
	 */
    create: function(adminId, roleId, done) {
        var objAdminId = config.mongojs.ObjectId(adminId);
        var objRoleId = config.mongojs.ObjectId(roleId);

        var entity = {
            adminId: objAdminId,
            roleId: objRoleId
        }

        adminRole.update(entity,{
            $set: entity
        }, {
            upsert: true
        }, _.partial(help.defaultCall, _, _, done));
    }







}
