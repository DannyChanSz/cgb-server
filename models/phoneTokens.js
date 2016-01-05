module.exports = {

    test: function(tokens) {
        tokens.push(tokens.length);
        console.info(tokens);
    },

    /**
     * 生成手机验证码
     * @param  {[type]}   tokens [description]
     * @param  {[type]}   phone  [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    generateIdentityCode: function(tokens, phone, done) {
        var code = generateCode(6);
        var time = new Date();
        var timeSpan = 10 * 60 * 1000; //ms
        time.setDate(time.getTime + timeSpan);
        var token = {
            code: code,
            phone: phone,
            endTime: time
        };

        tokens.push(token);
        console.info(tokens);
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
    	var tempTokens = tokens.slice(0);
    	var isExist = isExistPhoneAndCode(tempTokens,phone,code);
    	done(isExist);
    }


};

//是否存在手机+验证码
var isExistPhoneAndCode = function (tokens,phone,code)
{
	var codeList =findTokenByPhone(tokens,phone);
	for(phoneCode in codeList)
	{
		if(phoneCode==code)
		{
			return true;
		}
	}
	return false;
}

//查询手机号所有验证码
var findTokenByPhone = function(tokens, phone) {
	var codeList = new Array();
	for(token in tokens)
	{
		if(token.phone==phone)
		{
			codeList.push(token.code);
		}
	}
	return codeList;
}

//生成验证码
var generateCode = function(max) {
    var code = '';
    for (var i = 0; i < max; i++) {
        var num = parseInt(Math.random() * 10);
        code += num;
    };

    return code;
}
