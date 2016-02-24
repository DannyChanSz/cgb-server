var config = require("../config/config.js");
var _ = require("underscore");

/**
 * 基础类
 * @param  {[type]} modelName [description]
 * @return {[type]}           [description]
 */
module.exports = function(modelName) {

    var db = config.db.collection(modelName);

    /**
     * 默认返回方法
     * @param  {[type]}   err     [description]
     * @param  {[type]}   success [description]
     * @param  {Function} done    [description]
     * @return {[type]}           [description]
     */
    this.defaultCall = function(err, success, done) {
        if (!err) {
            return done({
                status: true,
                data: success
            });
        } else {
            return done({
                status: false,
                data: err
            });
        }
    };

    /**
     * 新增
     * @param  {[type]}   entity [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.create = function(entity, done) {
        db.insert(entity, _.partial(this.defaultCall, _, _, done));
    };

    /**
     * 查询所有
     * @param  {[type]}   filter [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.findAll = function(filter, done) {

        db.find(filter, _.partial(this.defaultCall, _, _, done));
    };

    /**
     * 查询
     * @param  {[type]}   filter [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.findOne = function(filter, done) {
        db.findOne(filter, _.partial(this.defaultCall, _, _, done));
    };

    /**
     * id查询
     * @param  {[type]}   id   [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    this.findById = function(id, done) {
        db.findOne({ _id: config.mongojs.ObjectId(id) }, _.partial(this.defaultCall, _, _, done));
    }

    /**
     * 更新
     * @param  {[type]}   filter [description]
     * @param  {[type]}   entity [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.update = function(filter, entity, done) {
        db.update(filter, {
            $set: entity
        }, _.partial(this.defaultCall, _, _, done));
    };


    /**
     * 设置（若无则添加）
     * @param  {[type]}   filter [description]
     * @param  {[type]}   entity [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.upsert = function(filter, entity, done) {

        db.update(filter, {
            $set: entity
        }, {
            upsert: true
        }, _.partial(this.defaultCall, _, _, done));
    };

    /**
     * [remove description]
     * @param  {[type]}   filter [description]
     * @param  {Function} done   [description]
     * @return {[type]}          [description]
     */
    this.remove = function(filter, done) {
        db.remove(filter, _.partial(this.defaultCall, _, _, done));
    };

    /**
     * id删除
     * @param  {[type]}   id   [description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    this.removeById = function(id, done) {
        db.remove({ _id: config.mongojs.ObjectId(id) }, _.partial(this.defaultCall, _, _, done));
    }

}
