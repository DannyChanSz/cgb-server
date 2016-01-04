var config = require("../config/config.js");
var entities = config.db.collection("orders");



var testData = [
    {
        "orderId": "0",
        "productName": "高密度聚乙烯PPD沙发客3023",
        "productAmount": "4",
        "date": "2015-02-05",
        "state": "我要报价",
        "trackInfo": false
    }
];

module.exports = {

    findAll: function findAll(req, res, next) {
        config.resHead(res);
        //res.send(200,testData);

        entities.find().limit(20).sort({
            postedOn: -1
        }, function(err, success) {
            console.log('Response success ' + success);
            console.log('Response error ' + err);
            if (success) {
                res.send(200, success);
                return next();
            } else {
                return next(err);
            }

        });

    },

    find: function find(req, res, next) {
        config.resHead(res);
        console.log(JSON.stringify(req.params.id));
        entities.findOne({
            _id: config.mongojs.ObjectId(req.params.id)
        }, function(err, success) {
            console.log('Response success ' + success);
            console.log('Response error ' + err);
            if (success) {
                res.send(200, success);
                return next();
            }

        })
    },

    postNew: function postNew(req, res, next) {
        config.resHead(res);
        console.log('posted:'+JSON.stringify(req.params));
        var entity = req.params;
        entity.postedOn = new Date();

        



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
    },

    update: function update(req, res, next) {
        config.resHead(res);
        var entity = req.params;




        var id = entity._id;
        delete entity._id;

        entities.update({
            _id: config.mongojs.ObjectId(id)
        }, {
            $set: entity
        }, function(err, success) {
            console.log('Update success ' + JSON.stringify(success));
            console.log('Update error ' + err);
            if (success) {
                res.send(201, entity);
                return next();
            } else {
                return next(err);
            }
        });
    },

    remove: function remove(req, res, next) {
        config.resHead(res);

        entities.remove({
            _id: config.mongojs.ObjectId(req.params.id)
        }, function(err, success) {
            console.log('Response success ' + success);
            console.log('Response error ' + err);
            if (success) {
                res.send(204);
                return next();
            } else {
                return next(err);
            }
        })

    }

};
