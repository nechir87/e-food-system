var express = require('express');
var router = express.Router();
var Manager = require('../models/manager.js');
var Menu = require('../models/menu.js');
var Order = require('../models/order.js');
var Deliver = require('../models/deliver.js');
var Check = require('../models/check.js');

/*
// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/public/views/log_mgr.html'));
});
*/
//POST route for loggin managers
router.post('/api/mgrlogin', function (req, res, next) {
    if (req.body.logmgr_name && req.body.logpassword) {
        Manager.authenticate(req.body.logmgr_name, req.body.logpassword, function (error, manager) {
            if (error || !manager) {
                var err = new Error('Wrong manager name or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.managerId = manager._id;
                return res.redirect('/api/mgrprofile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

// GET route after loggin 
router.get('/api/mgrprofile', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Manager not found! Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.json(manager);
                }
            }
        });
});
// PUT route for updating manager
router.put('/api/mgrupdate', function (req, res, next) {
    var putManager = req.body;
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Manager.updateManager(req.session.managerId, putManager, {}, function (err, manager) {
                        if (err) return next(err);
                        Manager.getManagerById(req.session.managerId, function(err, newManager){
                            if (err) return next(err);
                            res.json(newManager);
                        });
                    });
                }
            }
        });
});
// DELETE route for deleting manager
router.delete('/api/mgrdelete', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Manager not found! Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Manager.removeManager(req.session.managerId, function(err, manager){
                        if(err) return next(err);
                        res.json('You have successfully deleted your account');
                    });
                }
            }
        });
});
//Manager adds new menu
router.post('/api/mgrmenu', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    var newMenu = {
                        rest_name: manager.rest_name,
                        mgr_name: manager.mgr_name,
                        dish_name: req.body.dish_name,      //from req.body
                        img_url: req.body.img_url,
                        price: req.body.price,
                        ingredient: req.body.ingredient,
                        diabetes: req.body.diabetes
                    }
                    Menu.addDish(newMenu, function(err, menu){
                        if (err) return next(err);
                        res.json(menu);
                    });
                }
            }
        });
});
//Manager gets his menu
router.get('/api/mgrmenus', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Menu.getDishes(function(err, dishes){
                        if(err) return next(err);
                        myMenu = [];
                        for(var d in dishes){
                            if(dishes[d].mgr_name === manager.mgr_name 
                                && dishes[d].rest_name.toUpperCase() === manager.rest_name.toUpperCase()){
                                myMenu.push(dishes[d]);
                            }
                        }
                        res.json(myMenu);
                    });
                }
            }
        });
});
//Manager gets one dish by ID
router.get('/api/mgrmenu/:_id', function (req, res, next) {
    var id = req.params._id;
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Menu.getDishById(id, function(err, dish){
                        if (err) {
                            return next(err);
                        }else if(!dish){
                            var err = new Error('Not found!');
                            err.status = 401;
                            return next(err);
                        }else if(manager.mgr_name === dish.mgr_name 
                            && manager.rest_name.toUpperCase() === dish.rest_name.toUpperCase()){
                            res.json(dish)
                        }else{
                            var err = new Error('Not authorized! Go back!');
                            err.status = 401;
                            return next(err);
                        }
                    });
                }
            }
        });
});

//Manager update menu
router.put('/api/mgrmenu/:_id', function (req, res, next) {
    var id = req.params._id;
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    var dish = {
                        mgr_name: manager.mgr_name,
                        rest_name: manager.rest_name,
                        dish_name: req.body.dish_name,
                        img_url: req.body.img_url,
                        price: req.body.price,
                        ingredient: req.body.ingredient
                    }
                    //console.log(dish);
                    Menu.getDishById(id, function (err, findDish) {
                        if (err) return next(err);
                        else if (manager.rest_name === findDish.rest_name 
                            && manager.mgr_name.toUpperCase() === findDish.mgr_name.toUpperCase()) {
                            Menu.updateDish(id, dish, {}, function (err, dish) {
                                if (err) return next(err);
                                Menu.getDishById(id, function (err, updateDish) {
                                    if (err) return next(err);
                                    res.json(updateDish);
                                });
                            });
                        } else {
                            var err = new Error('Not authorized! Go back!');
                            err.status = 401;
                            return next(err);
                        }
                    });
                }
            }
        });
});
//Manager deletes dish by ID
router.delete('/api/mgrmenu/:_id', function (req, res, next) {
    var id = req.params._id;
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Menu.getDishById(id, function (err, dish) {
                        if (err) {
                            return next(err);
                        } else if (!dish) {
                            var err = new Error('Not found!');
                            err.status = 401;
                            return next(err);
                        } else if (manager.mgr_name === dish.mgr_name
                             && manager.rest_name.toUpperCase() === dish.rest_name.toUpperCase()) {
                            Menu.removeDish(id, function (err, dish) {
                                if (err) return next(err);
                                res.json(dish);
                            });
                        } else {
                            var err = new Error('Not authorized! Go back!');
                            err.status = 401;
                            return next(err);
                        }
                    });
                }
            }
        });
});

//Manager gets his ordered list
router.get('/api/mgrorderlist', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Order.getOrders(function(err, orders){
                        if(err) return next(err);
                        myOrders = [];
                        for(var index in orders){
                            if(orders[index].rest_name.toUpperCase() === manager.rest_name.toUpperCase()){
                                myOrders.push(orders[index]);
                            }
                        }
                        res.json(myOrders);
                    });
                }
            }
        });
});
//Manager gets his delivered list
router.get('/api/mgrdeliveredlist', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Deliver.getDelivers(function(err, delivers){
                        if(err) return next(err);
                        myDelivers = [];
                        for(var index in delivers){
                            if(delivers[index].rest_name.toUpperCase() === manager.rest_name.toUpperCase()){
                                myDelivers.push(delivers[index]);
                            }
                        }
                        res.json(myDelivers);
                    });
                }
            }
        });
});
//Manager makes delivers
router.post('/api/mgrsentdeliver', function (req, res, next) {
    Manager.findById(req.session.managerId)
        .exec(function (error, manager) {
            if (error) {
                return next(error);
            } else {
                if (manager === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    var id = req.body._id;
                    var deliver;
                    Order.getOrderById(id, function (err, order) {
                        if (err) return next(err);
                        else if (order === null) {
                            var err = new Error('No order found!');
                            err.status = 404;
                            return next(err);
                        } else if(order.rest_name.toUpperCase() === manager.rest_name.toUpperCase()) {
                            deliver = {
                                dish: order.dish,
                                username: order.username,
                                rest_name: order.rest_name,
                                check_no: order.check_no,
                                address: order.address,
                                order_date: order.ordered_date,
                                delivered: true
                            }
                            Order.removeOrder(order._id, function (err, order) {
                                if (err) return next(err);
                            });
                            Deliver.addDeliver(deliver, function (err, deliversent) {
                                if (err) return next(err);
                                res.json(deliversent);
                            });
                        }
                        else {
                            var err = new Error('Not authorized! Go back!');
                            err.status = 401;
                            return next(err);
                        }
                    });
                }
            }
        });
});
// GET for logout logout
router.get('/api/mgrlogout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;