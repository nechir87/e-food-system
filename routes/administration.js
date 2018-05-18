var express = require('express');
var router = express.Router();
var Admin = require('../models/admin/admin.js');
var Manager = require('../models/manager.js');
var User = require('../models/user.js');
var Restaurant = require('../models/restaurant.js');
var Menu = require('../models/menu.js');
var Order = require('../models/order.js');
var Deliver = require('../models/deliver.js');
var Check = require('../models/check.js');
var Inbox = require('../models/contactus.js');

//POST route for loggin admin
router.post('/api/admin/login', function (req, res, next) {
    // confirm that admin typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
    }
    if (req.body.admin &&
        req.body.password &&
        req.body.passwordConf &&
        req.body.first_name &&
        req.body.last_name) {

        var adminData = {
            admin: req.body.admin,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }
        Admin.create(adminData, function (error, admin) {
            if (error) {
                return next(error);
            } else {
                req.session.adminId = admin._id;
                return res.redirect('/api/admin/profile');
            }
        });
    } 
    //this for loggin admin 
    else if (req.body.logadmin && req.body.logpassword) {
        Admin.authenticate(req.body.logadmin, req.body.logpassword, function (error, admin) {
            if (error || !admin) {
                var err = new Error('Who the hell are you!');
                err.status = 401;
                return next(err);
            } else {
                req.session.adminId = admin._id;
                return res.redirect('/api/admin/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

// GET route after loggin 
router.get('/api/admin/profile', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    res.json(admin);
                }
            }
        });
});
// Adding a manager by admin
router.post('/api/admin/addmanager', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    // confirm that admin typed same password twice
                    if (req.body.password !== req.body.passwordConf) {
                        var err = new Error('Passwords do not match.');
                        err.status = 400;
                        return next(err);
                    }
                    if (req.body.mgr_name &&
                        req.body.password &&
                        req.body.passwordConf &&
                        req.body.first_name &&
                        req.body.last_name &&
                        req.body.rest_name) {

                        var managerData = {
                            mgr_name: req.body.mgr_name,
                            password: req.body.password,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            rest_name: req.body.rest_name
                        }
                        Manager.create(managerData, function (error, manager) {
                            if (error) {
                                return next(error);
                            } else {
                                res.json(manager);
                            }
                        });
                    } else {
                        var err = new Error('All fields required.');
                        err.status = 400;
                        return next(err);
                    }
                }
            }
        });
});
//Getting managers
router.get('/api/admin/getmanagers', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Manager.getManagers(function(err, managers){
                        if(err) return next(err);
                        res.json(managers);
                    });
                }
            }
        });
});
//Getting a single manager by Id
router.get('/api/admin/getmanager/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Manager.getManagerById(id, function(err, manager){
                        if(err) return next(err);
                        res.json(manager);
                    });
                }
            }
        });
});
//Deleting manager by admin
router.delete('/api/admin/removemanager/:_id', function (req, res, next) {
    var id = req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Manager.getManagerById(id, function(err, manager){
                        if(err) return next(err);
                        else{
                            removedMgr = {
                                mgr_name: manager.mgr_name,
                                first_name: manager.first_name,
                                last_name: manager.last_name,
                                rest_name: manager.rest_name,
                                status: 'This manager has been removed!'
                            }
                            Manager.removeManager(id, function(err, mgr){
                                if(err) return next(err);
                                res.json(removedMgr);
                            });
                        }
                    });
                }
            }
        });
});
//Adding a user by admin
router.post('/api/admin/adduser', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    // confirm that admin typed same password twice
                    if (req.body.password !== req.body.passwordConf) {
                        var err = new Error('Passwords do not match.');
                        err.status = 400;
                        return next(err);
                    }
                    if (req.body.username &&
                        req.body.password &&
                        req.body.passwordConf &&
                        req.body.first_name &&
                        req.body.last_name &&
                        req.body.address) {

                        var userData = {
                            username: req.body.username,
                            password: req.body.password,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            address: req.body.address
                        }
                        User.create(userData, function (error, user) {
                            if (error) {
                                return next(error);
                            } else {
                                res.json(user);
                            }
                        });
                    } else {
                        var err = new Error('All fields required.');
                        err.status = 400;
                        return next(err);
                    }
                }
            }
        });
});
//Getting users
router.get('/api/admin/getusers', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    User.getUsers(function(err, users){
                        if(err) return next(err);
                        res.json(users);
                    });
                }
            }
        });
});
//Getting a single user by Id
router.get('/api/admin/getuser/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    User.getUserById(id, function(err, user){
                        if(err) return next(err);
                        res.json(user);
                    });
                }
            }
        });
});
//Deleting user by admin
router.delete('/api/admin/removeuser/:_id', function (req, res, next) {
    var id = req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    User.getUserById(id, function(err, user){
                        if(err) return next(err);
                        else{
                            removedUser = {
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                address: user.address,
                                status: 'This user has been removed!'
                            }
                            User.removeUser(id, function(err, user){
                                if(err) return next(err);
                                res.json(removedUser);
                            });
                        }
                    });
                }
            }
        });
});
//Adding a restaurant by admin
router.post('/api/admin/addrestaurant', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    if (req.body.rest_name &&
                        req.body.address) {

                        var restData = {
                            rest_name: req.body.rest_name,
                            address: req.body.address
                        }
                        Restaurant.create(restData, function (error, restaurant) {
                            if (error) {
                                return next(error);
                            } else {
                                res.json(restaurant);
                            }
                        });
                    } else {
                        var err = new Error('All fields required.');
                        err.status = 400;
                        return next(err);
                    }
                }
            }
        });
});
//Getting restaurants
router.get('/api/admin/getrestaurants', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Restaurant.getRestaurants(function(err, restaurants){
                        if(err) return next(err);
                        res.json(restaurants);
                    });
                }
            }
        });
});
//Getting a single restaurant by Id
router.get('/api/admin/getrestaurant/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Restaurant.getRestaurantById(id, function(err, restaurant){
                        if(err) return next(err);
                        res.json(restaurant);
                    });
                }
            }
        });
});
//Deleting restaurant by admin
router.delete('/api/admin/removerestaurant/:_id', function (req, res, next) {
    var id = req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Restaurant.getRestaurantById(id, function(err, rest){
                        if(err) return next(err);
                        else{
                            removedRest = {
                                rest_name: rest.rest_name,
                                address: rest.address,
                                create_date: rest.create_date,
                                status: 'This Restaurant has been removed!'
                            }
                            Restaurant.removeRestaurant(id, function(err, restaurant){
                                if(err) return next(err);
                                res.json(removedRest);
                            });
                        }
                    });
                }
            }
        });
});
//update restaurant by Id
router.put('/api/admin/updaterestaurant/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Restaurant.updateRestaurant(id, req.body, {}, function(err, restaurant){
                        if(err){
                            return next(err);
                        }
                        Restaurant.getRestaurantById(id, function(err, newRest){
                            if (err) return next(err);
                            res.json(newRest);
                        });
                    });
                }
            }
        });
});
//Getting orders
router.get('/api/admin/getpendingorders', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Order.getOrders(function(err, orders){
                        if(err) return next(err);
                        res.json(orders);
                    });
                }
            }
        });
});
//Getting a single order by Id
router.get('/api/admin/getpendingorder/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Order.getOrderById(id, function(err, order){
                        if(err) return next(err);
                        res.json(order);
                    });
                }
            }
        });
});
//Getting delivers
router.get('/api/admin/getdelivers', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Deliver.getDelivers(function(err, delivers){
                        if(err) return next(err);
                        res.json(delivers);
                    });
                }
            }
        });
});
//Getting a single deliver by Id
router.get('/api/admin/getdeliver/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Deliver.getDeliverById(id, function(err, deliver){
                        if(err) return next(err);
                        res.json(deliver);
                    });
                }
            }
        });
});
//Getting checks
router.get('/api/admin/getchecks', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Check.getChecks(function(err, checks){
                        if(err) return next(err);
                        res.json(checks);
                    });
                }
            }
        });
});
//Getting a single Check by Id
router.get('/api/admin/getcheck/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Check.getCheckById(id, function(err, check){
                        if(err) return next(err);
                        res.json(check);
                    });
                }
            }
        });
});
//Getting a single Check by Check No
router.post('/api/admin/getcheck', function (req, res, next) {
    var checkNo= req.body.checkNo;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Check.getCheckByNo(checkNo, function(err, check){
                        if(err) return next(err);
                        res.json(check);
                    });
                }
            }
        });
});
//Get inbox
router.get('/api/admin/inbox', function (req, res, next) {
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Inbox.getMessages(function(err, messages){
                        if(err) return next(err);
                        res.json(messages);
                    });
                }
            }
        });
});
//Get a single message by Id
router.get('/api/admin/inbox/:_id', function (req, res, next) {
    var id= req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Inbox.getMessageById(id, function(err, message){
                        if(err) return next(err);
                        res.json(message);
                    });
                }
            }
        });
});
//Delete message by admin
router.delete('/api/admin/inbox/:_id', function (req, res, next) {
    var id = req.params._id;
    Admin.findById(req.session.adminId)
        .exec(function (error, admin) {
            if (error) {
                return next(error);
            } else {
                if (admin === null) {
                    var err = new Error('Who the hell are you!');
                    err.status = 400;
                    return next(err);
                } else {
                    Inbox.removeMessage(id, function(err, message){
                        if(err) return next(err);
                        res.json('The message has been deleted from inbox.');
                    });
                }
            }
        });
});
router.get('/api/admin/logout', function (req, res, next) {
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