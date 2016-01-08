var config = require("../config/config.js");
var keywordModel = require("../models/keyword.js");
var _ = require("underscore");

module.exports = {
    //获取关键字
    getKeywords: function(req, res, done) {

        config.resHead(res);
        var userId = req.userId;

        keywordModel.getkeywordsByUser(userId, function(result) {

            if (result.status) {
                res.json({
                    status: true,
                    data: result.data
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: result.err
                });
                res.end();
            }
        })

    },
    //设置关键字
    setKeywords: function(req, res, done) {
        config.resHead(res);
        var userId = req.userId;
        var keywords = req.params.keywords;

        keywordModel.getkeywordsByUser(userId, function(result) {

            if (result.status) {

                keywordModel.updateUserKeywords(result.data._id, userId, keywords, function(upResult) {

                    if (upResult.status) {
                    	
                        res.json({
                            status: true,
                            data: upResult.data
                        });
                        res.end();

                    } else {
                        res.json({
                            status: false,
                            errMsg: upResult.err
                        });
                        res.end();
                    }


                });


            } else {
                //添加
                keywordModel.addUserKeywords(userId, keywords, function(addResult) {

                    if (addResult.status) {
                        res.json({
                            status: true,
                            data: addResult.data
                        });
                        res.end();

                    } else {

                        res.json({
                            status: false,
                            errMsg: result.err
                        });
                        res.end();
                    }
                });


            }
        })
    }


}
