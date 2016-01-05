var App = require('./alidayu.js');

var app = new App('23293402', '6bacac873e5622d30605b1a7f0fde649');


module.exports = {
    /**
     * [smsSend 发送验证短信]
     * @param  {[type]} phone [号码]
     * @param  {[type]} type  [类型]
     * @param  {[type]} code  [验证码]
     * @return {[type]}       [description]
     */
    smsSend: function(phone, type, code, next) {

        var signType = getSignType(type);
        //发短信
        app.smsSend({
            sms_free_sign_name: signType.key,
            sms_param: JSON.stringify({
                "code": code,
                "product": signType.value
            }),
            rec_num: phone,
            sms_template_code: 'SMS_4065690'
        }, function(res) {

            console.log('sms:', res);
            next(res);
        });
    }

}



//签名类型提示
var SIGN_TYPE = [{
    key: '注册验证',
    value: '采购宝'
}, {
    key: '变更验证',
    value: '修改密码'
}];

//获取签名类型
var getSignType = function(type) {
    for (var i = 0; i < SIGN_TYPE.length; i++) {
        if (type == SIGN_TYPE[i].key) {
            return SIGN_TYPE[i];
        }
    };
}
