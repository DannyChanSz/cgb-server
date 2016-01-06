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
    }





}
