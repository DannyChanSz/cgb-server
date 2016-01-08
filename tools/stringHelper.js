module.exports = {
    /**
     * 生成随机生成数字
     * @param  {[type]} maxCount [description]
     * @return {[type]}          [description]
     */
    generateNumCode: function(maxCount) {
        var code = '';
        for (var i = 0; i < maxCount; i++) {
            var num = parseInt(Math.random() * 10);
            code += num;
        };

        return code;
    },

    /**
     * 生成订单号
     * @return {[type]} [description]
     */
    generateOrderName: function() {

        var nowDate = new Date();
        var orderName = nowDate.Format("yyyyMMddhhmmssS");
        return orderName;

    }



}

//时间转字符串
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
