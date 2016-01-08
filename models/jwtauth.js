var jwt = require('jwt-simple');
var config = require("../config/config.js");

module.exports = function(req, res, next) {
    // code goes here

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            console.log('start decode...' + token);
            var decoded = jwt.decode(token, config.jwtTokenSecret);
            console.log('decoded', decoded);
            // handle token here

            if (decoded.exp <= Date.now()) {
                res.statusCode = 401;
                res.end('Access token has expired');
            }

            /*User.findOne({
                _id: decoded.iss
            }, function(err, user) {
                req.user = user;
            });*/

            req.userId = decoded.iss;
            //console.log('token user', req.userId)
            return next();

        } catch (err) {
            console.log('err:' + err);
            res.statusCode = 401;
            res.end('err:' + err);
        }
    } else {
        console.log('no token');
        res.statusCode = 401;
        res.end('Login first')
            //next();
    }
};
