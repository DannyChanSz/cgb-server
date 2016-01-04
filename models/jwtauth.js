var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
    // code goes here

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            console.log('start decode...'+token);
            var decoded = jwt.decode(token, '123456789');
            console.log(decoded);
            // handle token here

            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }

            /*User.findOne({
                _id: decoded.iss
            }, function(err, user) {
                req.user = user;
            });*/
            console.log(decoded.iss);
            req.user = decoded.iss;
            return next();

        } catch (err) {
            console.log('err:' + err);
            return next();
        }
    } else {
        console.log('no token');
        next();
    }
};
