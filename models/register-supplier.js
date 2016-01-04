var config = require("../config/config.js");
var supplier =require("../models/supplier.js");





module.exports = {

    checkPhone: function checkPhone(req, res, next) {
        config.resHead(res);
        supplier.findAll(req,res,next);
        
        return next();

    }
};
