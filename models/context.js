var base = require('./base.js');

/**
 * 模型访问(及继承关系)管理
 * 非继承对象直接require的json对象
 */
module.exports = {

    user: function() {
        return inheritClone(base, 'user');
    },
    userProfile: function() {
        return inheritClone(base, 'userProfile');
    },
    order: function() {
        return inheritClone(base, 'order');
    },
    quotation: function() {
        return inheritClone(base, 'quotation');
    },
    keyword: function() {
        return inheritClone(base, 'keyword');
    },
    logistics: function() {
        return inheritClone(base, 'logistics');
    },
    admin: function() {
        return inheritClone(base, 'admin');
    }

}

/**
 * 模型继承克隆方法
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function inheritClone(parent, child) {

    var result = {};
    parent.call(result, child);

    var model = require('./' + child + '.js');
    for (var key in model) {
        result[key] = model[key];
    }

    return result;

}
