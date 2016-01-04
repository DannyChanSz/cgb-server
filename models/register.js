var supplier = require('./supplier.js');
var moment = require('moment');
var config = require("../config/config.js");

module.exports = {

    supplierCheckEmail: function(req, res, next) {
    	var email=req.params.email;
    	
        supplier.checkEmail(email, function(exists) {
            if (exists) {
                res.json({
                    success: false                    
                });
                return next();
            } else {
                res.json({
                    success: true
                });
                return next();

            }
        });        
    }
}
