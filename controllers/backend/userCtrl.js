//var config = require("../../config/config.js");

var user = require('../../models/context.js').user();

/**
 * 会员管理
 * @type {Object}
 */
module.exports = {

    /**
     * 会员列表
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    findAll: function(req, res, done) {
        user.findAll({}, function(result) {
            res.json(result)
            res.end();
        })

    },
    /**
     * 会员详情
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    getById: function(req, res, done) {

        var id = req.params.id;

        user.getByUserId(id, function(result) {
            res.json(result);
            res.end();
        })

    },
    /**
     * 修改审核状态
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    changeAudit: function(req, res, done) {

        var id = req.params.id;
        var ifAuditPass = req.params.ifAuditPass;

        user.changeAudit(id, ifAuditPass, function(result) {
            res.json(result);
            res.end();
        })

    },



}
