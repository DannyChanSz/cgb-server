var config = require("../config/config.js");
var entities = config.db.collection("supplierkeywords");


/*
商品关键字：
id,userId,keyword
*/


module.exports = {

    release: function(req, res, next) {
        config.resHead(res);
        console.log('posted:' + JSON.stringify(req.params));
        entities.find({
            userId: req.params.user
        }).forEach(function(err,doc){
            
        });



    },
    add: function(userId, keyword) {
        var entity = {
            userId: userId,
            keyword: keyword
        };

        entities.save(entity, function(err, success) {
            console.log('Post success ' + success);
            console.log('Post error ' + err);
            if (success) {
                res.send(201, entity);
                return next();
            } else {
                return next(err);
            }
        });
    }

};
