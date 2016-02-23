
var admin = require('../../models/context.js').admin();

/**
 * 管理员账号管理
 * @type {Object}
 */
module.exports = {



    findAll: function(req, res, done) {

        admin.findAll({}, function(result) {
            res.json(result)
            res.end();
        })

    }




}
