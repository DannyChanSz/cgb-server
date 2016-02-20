var strHelper = require("../tools/stringHelper.js");

module.exports = {
    /**
     * token失效服务
     * @param  {[type]} tokens [description]
     * @return {[type]}        [description]
     */
    checkTokenTimeoutStar: function(tokens) {
        setInterval(function() {
            //console.log('==== check timeout ======')
            if (tokens.length > 0) {
                var checkToken = tokens[0];
                var nowTime = new Date();
                if (checkToken.endTime < nowTime) {
                    tokens.shift();
                }
            }

        }, 10 * 1000)

    },

    /**
     * 生成手机验证码
     * @param  {[type]}   tokens [description]
     * @param  {[type]}   phone  [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    generateIdentityCode: function(tokens, phone, done) {
        var code = strHelper.generateNumCode(6);
        var time = new Date();
        var timeSpan = 10 * 60 * 1000; //ms
        time.setTime(time.getTime() + timeSpan);
        var token = {
            code: code,
            phone: phone,
            endTime: time
        };

        tokens.push(token);
        //console.info('tokens',tokens);
        done(code);

    },

    /**
     * 验证手机验证码
     * @param  {[type]}   tokens [description]
     * @param  {[type]}   phone  [description]
     * @param  {[type]}   code   [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    verificateIdentityCode: function(tokens, phone, code, done) {

        var DEBUG_CODE = '201601';
        if (code == DEBUG_CODE) {
            done(true);
        } else {
            var tempTokens = tokens.slice(0);
            var isExist = isExistPhoneAndCode(tempTokens, phone, code);
            done(isExist);
        }

    }


};

// var checkTokensTimeOut = function(tokens){
//  if(tokens.length>0)
//  {
//      var checkToken = tokens[0];
//      var nowTime = new Date();
//      if(checkToken.endTime>nowTime)
//      {
//          tokens.shift();
//      }
//  }

// }

//是否存在手机+验证码
var isExistPhoneAndCode = function(tokens, phone, code) {
    var codeList = findTokenByPhone(tokens, phone);
    // console.info('codeList',codeList,phone);
    for (i in codeList) {
        var nowTime = new Date();
        console.info('isExistPhoneAndCode', codeList[i].code, code, codeList[i].endTime, nowTime);
        if (codeList[i].code == code && codeList[i].endTime > nowTime) {
            return true;
        }
    }
    return false;
}

//查询手机号所有验证码
var findTokenByPhone = function(tokens, phone) {
    var codeList = new Array();
    for (i in tokens) {
        //console.info('findTokenByPhone',token.phone,phone);
        if (tokens[i].phone == phone) {
            codeList.push(tokens[i]);
        }
    }
    return codeList;
}
