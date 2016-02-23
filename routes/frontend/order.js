var jwtauth = require('../../models/jwtauth.js');
var middlewares = require('../../middleware/middlewares.js');

var orderCtrl = require('../../controllers/frontend/orderCtrl.js');

/**
 * 订单路由
 * @param  {[type]} server [description]
 * @return {[type]}        [description]
 */
module.exports = function(server) {

    //========
    var PATH_ORDER = '/order';

    //添加订单(登陆权限)
    //productName,productAmount,productUnit,shipAddress
    server.post({
        path: PATH_ORDER + '/createOrder',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.addOrder);



    //获取新自身订单及其他报价状态订单(登陆权限)
    //oldCount:当前页面记录条数  oldMaxCount:最近一次请求返回的所有记录总数
    server.get({
        path: PATH_ORDER + '/getMyNewOrders/:oldCount/:oldMaxCount',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getMyNewOrders);

    server.get({
        path: PATH_ORDER + '/getMyNewOrders/:oldCount/:oldMaxCount/:orderState',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getMyNewOrders);


    //获取历史自身订单及其他报价状态订单(登陆权限)
    //count：要请求的数量 oldCount:当前页面记录条数 oldMaxCount:最近一次请求返回的所有记录总数
    server.get({
        path: PATH_ORDER + '/getMyOldOrders/:count/:oldCount/:oldMaxCount',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getMyOldOrders);

    server.get({
        path: PATH_ORDER + '/getMyOldOrders/:count/:oldCount/:oldMaxCount/:orderState',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getMyOldOrders);


    //获取订单信息
    server.get({
        path: PATH_ORDER + '/getByOrderName/:orderName',
        version: '0.0.1'
    }, jwtauth, orderCtrl.getByOrderName);

    //添加报价单
    //unitPrice,sumPrice,orderName
    server.post({
        path: PATH_ORDER + '/setQuotation',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.setQuotation);

    //获取供应商本人报价单
    server.get({
        path: PATH_ORDER + '/getSupQuotation/:orderName',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getSupQuotation);

    //获取采购商订单的报价单列表
    //pageIndex:页码 count:请求数量
    server.get({
        path: PATH_ORDER + '/getPurQuotations/:orderName/:pageIndex/:count',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, orderCtrl.getPurQuotations);

    //选择订单报价
    //orderName,quotationId
    server.post({
        path: PATH_ORDER + '/chooseOrderQuotation',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.chooseOrderQuotation);

    //发货
    //orderName
    server.post({
        path: PATH_ORDER + '/sendGoods',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.sendGoods);

    //获取订单物流列表
    server.get({
        path: PATH_ORDER + '/getLogistics/:orderName',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.getLogistics);

    //添加物流信息
    //orderName,info
    server.post({
        path: PATH_ORDER + '/addLogistics',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.addLogistics);

    //完成订单
    //orderName
    server.post({
        path: PATH_ORDER + '/finshOrder',
        version: '0.0.1'
    }, jwtauth, middlewares.getUserInfo, middlewares.getOrderInfo, orderCtrl.finshOrder);
}
