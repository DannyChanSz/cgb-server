var supplier = require('./supplier.js');
var jwt = require('jwt-simple')
var moment = require('moment');
var jwtauth = require('./jwtauth.js');
var config = require("../config/config.js");

module.exports = {

    supplierEmailLogin: function(req, res, next) {
    	var user=req.params.user;
    	var password=req.params.password;
        supplier.emailLogin(user, password, function(success) {
            if (success) {
                var expires = moment().add(7, 'days').valueOf();
                var token = jwt.encode({
                    iss: user,
                    exp: expires
                }, config.jwtTokenSecret);

                res.json({
                    success: true,
                    token: token,
                    expires: expires,
                    user: user
                });
                return next();
            } else {
                res.json({
                    success: false,
                    user: user
                });
                return next();

            }
        });
    }
}
