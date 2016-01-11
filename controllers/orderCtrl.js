var config = require("../config/config.js");
var orderModel = require("../models/order.js");
var userModel = require("../models/user.js");
var userProfileModel = require("../models/userProfile.js");
var quotationModel = require("../models/quotation.js");
var logisticsModel = require("../models/logistics.js");
var _ = require("underscore");
var async = require("async");

module.exports = {

    //添加订单(采购商权限)
    addOrder: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        if (userinfo.userType == '采购商') {
            var paramsOrder = req.params;
            var userId = req.userId;

            //权限中间件用户信息
            paramsOrder.purUserId = userId;

            orderModel.addOrder(paramsOrder, function(result) {

                if (result.status) {
                    res.json({
                        status: true,
                        data: result.data
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: result.err
                    });
                    res.end();
                }

            })
        } else {
            res.json({
                status: false,
                errMsg: '无采购商权限'
            });
            res.end();
        }
    },
    //获取订单列表[待添加权限]
    getMyNewOrders: function(req, res, done) {

        config.resHead(res);
        var userId = req.userId;
        var endtime = new Date(req.params.endTime);
        //添加userType

        orderModel.getOrderByUserOrQuoteState(userId, function(result) {
            if (result.status) {
                //过滤
                var onTime = _.filter(result.data, function(o) {
                    return (o.createdOn > endtime)
                });
                //排序
                var orders = _.sortBy(onTime, 'createdOn').reverse();

                res.json({
                    status: true,
                    data: orders
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: result.err
                });
                res.end();
            }

        });
    },
    //获取历史订单列表[待添加权限]
    getMyOldOrders: function(req, res, done) {
        config.resHead(res);
        var userId = req.userId;
        var starTime = new Date(req.params.starTime);
        var count = req.params.count;

        orderModel.getOrderByUserOrQuoteState(userId, function(result) {
            if (result.status) {
                //过滤
                var onTime = _.filter(result.data, function(o) {
                    return (o.createdOn < starTime)
                });
                //排序
                var orders = _.sortBy(onTime, 'createdOn').reverse();

                res.json({
                    status: true,
                    data: orders.slice(0, count)
                });
                res.end();
            } else {
                res.json({
                    status: false,
                    errMsg: result.err
                });
                res.end();
            }

        });
    },
    //订单号获取订单信息（供应商/采购商权限）
    getByOrderName: function(req, res, done) {
        config.resHead(res);

        async.auto({
                //获取订单
                getOrder: function(callback) {
                    orderModel.getByOrderName(req.params.orderName,
                        function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data)
                            } else {
                                callback('getOrderErr', orderResult.err);
                            }

                        });
                },
                //获取采购商
                getPurUser: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    userModel.getByUserId(order.purUserId, function(purUserResult) {
                        if (purUserResult.status) {
                            callback(null, purUserResult.data)
                        } else {
                            callback('getPurUserErr', purUserResult.err);
                        }
                    });

                }],
                //获取供应商
                getSupUser: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    if (order.supUserId) {
                        userModel.getByUserId(order.supUserId, function(supUserResult) {
                            if (supUserResult.status) {
                                callback(null, supUserResult.data)
                            } else {
                                callback('getPurUserErr', supUserResult.err);
                            }
                        });
                    } else {
                        callback(null, null)
                    }
                }],



            },
            function(err, results) {

                if (!err) {
                    var order = results.getOrder;
                    var purchaser = results.getPurUser;
                    var supplier = results.getSupUser;

                    order.purchaser = purchaser;

                    order.supplier = supplier;

                    res.json({
                        status: true,
                        data: order
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        err: err
                    });
                    res.end();

                }
            });
    },
    //添加报价单（供应商权限）
    setQuotation: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        var unitPrice = req.params.unitPrice;
        var sumPrice = req.params.sumPrice;
        var orderName = req.params.orderName;


        if (userinfo.userType == '供应商') {

            async.waterfall([function(callback) {
                    orderModel.getByOrderName(orderName,
                        function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data)
                            } else {
                                callback('getOrderErr', orderResult.err);
                            }

                        });
                },
                function(order, callback) {
                    if (order.state == '报价') {
                        //添加报价单
                        quotationModel.setQuotation(unitPrice, sumPrice, userinfo._id, order._id, function(quoResult) {

                            if (quoResult.status) {
                                callback(null, quoResult.data)
                            } else {
                                callback('addQuotationErr', quoResult.err);
                            }
                        })
                    } else {
                        callback('订单已过报价阶段', null)
                    }

                }
            ], function(err, result) {

                if (!err) {
                    res.json({
                        status: true,
                        data: result
                    });
                    res.end();

                } else {
                    res.json({
                        status: false,
                        err: err
                    });
                    res.end();

                }

            });


        } else {
            res.json({
                status: false,
                errMsg: '无供应商权限'
            });
            res.end();
        }
    },
    //获取本人报价单(供应商权限)
    getSupQuotation: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        if (userinfo.userType == '供应商') {

            async.auto({
                //获取订单
                getOrder: function(callback) {
                    orderModel.getByOrderName(req.params.orderName,
                        function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data)
                            } else {
                                callback('getOrderErr', orderResult.err);
                            }

                        });
                },
                getQuotation: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    quotationModel.getQuotationsByUserAndOrder(userinfo._id, order._id, function(quoResult) {

                        if (quoResult.status) {
                            callback(null, quoResult.data)
                        } else {
                            callback('getQuotation', quoResult.err)
                        }

                    });
                }]
            }, function(err, results) {

                if (!err) {
                    res.json({
                        status: true,
                        data: results.getQuotation
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: '无报价单'
                    });
                    res.end();
                }

            })


        } else {
            res.json({
                status: false,
                errMsg: '无供应商权限'
            });
            res.end();
        }
    },
    //获取订单报价单(采购商:权限订单所有报价单)
    getPurQuotations: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        if (userinfo.userType == '采购商') {

            async.auto({
                //获取订单
                getOrder: function(callback) {
                    orderModel.getByOrderName(req.params.orderName,
                        function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data)
                            } else {
                                callback('getOrderErr', orderResult.err);
                            }

                        });
                },
                //获取报价单
                getQutationsByOrder: ['getOrder', function(callback, results) {
                    var order = results.getOrder;
                    quotationModel.getQutationsByOrder(order._id, function(quoResult) {

                        if (quoResult.status) {
                            callback(null, quoResult.data)
                        } else {
                            callback('getQutationsByOrder', quoResult.err)
                        }

                    });
                }],
                //报价单会员信息
                getQutationsUserInfo: ['getQutationsByOrder', function(callback, results) {

                    var quotations = results.getQutationsByOrder;
                    var quosWithUser = new Array();

                    var q = async.queue(function(quotation, qcb) {

                        userModel.getByUserId(quotation.userId, function(profileResult) {
                            if (profileResult.status) {
                                quotation.user = profileResult.data;
                                qcb(null, quotation)
                            } else {

                                qcb(null, quotation)
                            }
                        })

                    }, 5);

                    q.push(quotations, function(err, quotation) {
                        console.info('quotation', quotation);
                        quosWithUser.push(quotation);

                    });

                    q.drain = function() {
                        callback(null, quosWithUser);
                    }

                }]
            }, function(err, results) {

                if (!err) {
                    res.json({
                        status: true,
                        data: results.getQutationsUserInfo
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: '无报价单'
                    });
                    res.end();
                }

            })


        } else {
            res.json({
                status: false,
                errMsg: '无采购商权限'
            });
            res.end();
        }
    },
    //选择订单报价(采购商权限)
    chooseOrderQuotation: function(req, res, done) {
        config.resHead(res);

        var userinfo = req.userInfo;
        var order = req.orderInfo;

        var quotationId = req.params.quotationId;

        if (userinfo.userType == '采购商') {

            if (userinfo._id.toString() == order.purUserId.toString() && order.state == '报价') {

                async.auto({
                    getQuotation: function(callback) {
                        quotationModel.getQuotationById(quotationId, function(quoResult) {

                            if (quoResult.status) {
                                callback(null, quoResult.data);
                            } else {
                                callback('getQuotation', null);
                            }
                        })

                    },
                    chooseQuotation: ['getQuotation', function(callback, results) {
                        var quotation = results.getQuotation;
                        order.unitPrice = quotation.unitPrice;
                        order.sumPrice = quotation.sumPrice;
                        order.supUserId = quotation.userId;
                        order.state = '未支付';


                        orderModel.updateOrder(order, function(orderResult) {

                            if (orderResult.status) {
                                callback(null, orderResult.data);
                            } else {
                                callback('chooseQuotation', null);
                            }

                        })

                    }]
                }, function(err, results) {
                    if (!err) {
                        res.json({
                            status: true,
                            data: results.chooseQuotation
                        });
                        res.end();
                    } else {
                        res.json({
                            status: false,
                            errMsg: err
                        });
                        res.end();
                    }
                })




            } else {
                res.json({
                    status: false,
                    errMsg: '无权操作他人订单或非报价订单'
                });
                res.end();
            }

        } else {
            res.json({
                status: false,
                errMsg: '无采购商权限'
            });
            res.end();
        }
    },
    //发货(供应商权限)
    sendGoods: function(req, res, done) {

        config.resHead(res);

        var userinfo = req.userInfo;
        var order = req.orderInfo;

        if (userinfo.userType == '供应商') {

            if (userinfo._id.toString() == order.supUserId.toString() && (order.state == '未支付' || order.state == '已支付')) {

                //更新订单状态
                //添加物流记录
                async.auto({
                    updateOrder: function(callback) {
                        order.state = '已发货';
                        orderModel.updateOrder(order, function(orderResult) {
                            if (orderResult.status) {
                                callback(null, orderResult.data);
                            } else {
                                callback('updateOrder', null);
                            }

                        })
                    },
                    addLogistics: function(callback) {

                        logisticsModel.addLogistics(order._id, "供应商已发货", function(logisticsResult) {

                            if (logisticsResult.status) {
                                callback(null, logisticsResult.data);
                            } else {
                                callback('addLogistics', null);
                            }

                        })

                    }
                }, function(err, results) {
                    if (!err) {
                        res.json({
                            status: true,
                            data: order
                        });
                        res.end();
                    } else {
                        res.json({
                            status: false,
                            errMsg: err
                        });
                        res.end();
                    }

                })


            } else {
                res.json({
                    status: false,
                    errMsg: '无权操作他人订单或其他状态订单'
                });
                res.end();
            }

        } else {
            res.json({
                status: false,
                errMsg: '无供应商权限'
            });
            res.end();
        }
    },
    //获取物流列表
    getLogistics: function(req, res, done) {

        config.resHead(res);
        var userinfo = req.userInfo;
        var order = req.orderInfo;
        //console.info('order',order);
        if (userinfo._id.toString() == order.supUserId.toString() || userinfo._id.toString() == order.purUserId.toString()) {

            logisticsModel.getLogistics(order._id, function(logisticsResult) {
                if (logisticsResult.status) {
                    var logisticsList = _.sortBy(logisticsResult.data, 'createdOn').reverse();
                    res.json({
                        status: true,
                        errMsg: logisticsList
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: logisticsResult.err
                    });
                    res.end();
                }

            })

        } else {
            res.json({
                status: false,
                errMsg: '无权查看他人订单'
            });
            res.end();
        }

    },
    //添加物流信息(供应商权限)
    addLogistics: function(req, res, done) {

        config.resHead(res);
        var userinfo = req.userInfo;
        var order = req.orderInfo;


        var info = req.params.info;
        if (userinfo.userType == '供应商' && order.supUserId.toString() == userinfo._id.toString()) {

            logisticsModel.addLogistics(order._id, info, function(logisticsResult) {

                if (logisticsResult.status) {
                    res.json({
                        status: true,
                        data: logisticsResult.data
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: logisticsResult.err
                    });
                    res.end();
                }

            })
        } else {
            res.json({
                status: false,
                errMsg: '没有权限'
            });
            res.end();
        }

    },
    //完成订单
    finshOrder: function(req, res, done) {
        config.resHead(res);
        var userinfo = req.userInfo;
        var order = req.orderInfo;

        if (userinfo.userType == '采购商' && order.purUserId.toString() == userinfo._id.toString() && order.state == '已发货') {

            order.state = '已完成';
            orderModel.updateOrder(order, function(orderResult) {
                if (orderResult.status) {

                    res.json({
                        status: true,
                        data: orderResult.data
                    });
                    res.end();
                } else {
                    res.json({
                        status: false,
                        errMsg: orderResult.err
                    });
                    res.end();
                }

            })


        } else {
            res.json({
                status: false,
                errMsg: '没有权限'
            });
            res.end();
        }


    }






}
