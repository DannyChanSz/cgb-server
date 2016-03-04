var accessCtrl = require('../controllers/backend/accessCtrl.js');

var _ = require("underscore");


/**
 * 访问控制
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {


    /**
     * 后台管理接口白名单
     */
    var whitelist = [];
    whitelist.push('/backend/access/login/:userName/:password');
    whitelist.push('/backend/access/login/:userName:password');
    whitelist.push('/backend/access/getAllInferfaces');

    //用户
    // whitelist.push('/backend/user/findAll')
    // whitelist.push('/backend/user/getById/:id')
    // whitelist.push('/backend/user/changeAudit')
    // whitelist.push('/backend/admin/getCompletelyInfos/:userName');


    /**
     * 访问控制
     * @param  {[type]} req   [description]
     * @param  {[type]} res   [description]
     * @param  {[type]} done  [description]
     * @return {[type]}       [description]
     */
    server.pre(function(req, res, done) {

        if (req.getPath().indexOf('/backend') == 0) {
            //接口权限控制
            server.router.find(req, res, function(err, currentRoute, params) {
                var r = currentRoute ? currentRoute.name : null;
                if (!err) {
                    if (r == 'preflight') { //options请求
                        res.end();
                    }
                    if (r != 'preflight' && _.indexOf(whitelist, currentRoute.spec.path) == -1) { //白名单以外

                        accessCtrl.getWhiteList(req, res, function(inferfaces) { //用户权限以外
                            if (_.indexOf(inferfaces, currentRoute.spec.path) > -1) {
                                done();
                            } else {
                                res.send(401, { message: '无权访问该接口' });
                                res.end();
                            }
                        })
                    }

                } else {
                    res.send(err);
                    res.end();
                }
                done();
            })
        }

        done();
    });





}
