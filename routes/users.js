var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Menu = require('../models/menu.js');
var Order = require('../models/order.js');
var Deliver = require('../models/deliver.js');
var Check = require('../models/check.js');
var Inbox = require('../models/contactus.js');

/*
// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/public/index.html'));
});
router.get('/register', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/public/views/register.html'));
});
*/
router.get('/', function (req, res, next) {
    return res.send('Welcome to e-Food system. Please choose /api/route');
});

//POST route for updating data
router.post('/api/userlogin', function (req, res, next) {
    // confirm that user typed same password twice
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
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address
        }
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/api/userdishes');
            }
        });
    } 
    //if user directly log in without register.
    else if (req.body.logusername && req.body.logpassword) {
        User.authenticate(req.body.logusername.toLowerCase(), req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/api/userdishes');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

// GET route for getting a user
router.get('/api/userprofile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.json(user);
                }
            }
        });
});
// PUT route for updating users information 
router.put('/api/userupdate', function (req, res, next) {
    var putUser = req.body;
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    User.updateUser(req.session.userId, putUser, {}, function (err, user) {
                        if (err) return next(err);
                        User.getUserById(req.session.userId, function(err, newUser){
                            if (err) return next(err);
                            res.json(newUser);
                        });
                    });
                }
            }
        });
});
// DELETE route for deleting user.
router.delete('/api/userdelete', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    User.removeUser(req.session.userId, function(err, user){
                        if (err) return next(err);
                        res.send('You have successfully deleted your account');
                    });
                }
            }
        });
});
//Getting menu for user after login
router.get('/api/userdishes', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Menu.getDishes(function(err, dishes){
                        if (err) return next(err);
                        res.json(dishes);       //after loging user should redirect to here.
                    });
                }
            }
        });
});
//Getting favorate dishes for users
router.post('/api/userfavoritedish', function (req, res, next) {
    var filter = req.body.dname;
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Menu.getDishes(function(err, dishes){
                        if (err) return next(err);
                        result = [];
                        for(var d in dishes){
                            if(dishes[d].dish_name.toUpperCase().includes(filter.toUpperCase())){
                                result.push(dishes[d]);
                            }
                        }
                        res.json(result);
                    });
                }
            }
        });
});
//User makes new order
router.post('/api/userorder', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    var add;
                    if (req.body.address === '' || req.body.address === undefined) {
                        add = user.address;
                    } else {
                        add = req.body.address;
                    }
                    Check.getChecks(function (err, checks) {
                        if (err) return next(err);
                        var checkNo = 1000;
                        for (var ch in checks) {
                            if (checkNo < checks[ch].check_no) {
                                checkNo = checks[ch].check_no;
                            }
                        }
                        var newCheck = {
                            check_no: checkNo + 1,
                            username: user.username,
                            dish: req.body.dish,
                            rest_name: req.body.rest_name,
                            price: req.body.price,
                            address: add
                        }
                        if (req.body.dish && req.body.rest_name && req.body.price) {
                            Check.addCheck(newCheck, function (err, check) {
                                if (err) return next(err);
                                else {
                                    var order = {
                                        username: user.username,
                                        address: add,
                                        dish: req.body.dish,
                                        rest_name: req.body.rest_name,
                                        price: req.body.price,
                                        check_no: checkNo + 1,
                                        delivered: false
                                    }
                                    Order.addOrder(order, function (err, order) {
                                        if (err) return next(err);
                                        res.json(order);
                                    });
                                }
                            });
                        } else {
                            var err = new Error('All fields required.');
                            err.status = 400;
                            return next(err);
                        }
                    });
                }
            }
        });
});
//Get pending orders for user
router.get('/api/userpendingorders', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Order.getOrders(function(err, orders){
                        if (err) return next(err);
                        result = [];
                        for(var order in orders){
                            if(orders[order].username === user.username){
                                var record = {
                                    _id: orders[order]._id,
                                    username: orders[order].username,
                                    address: orders[order].address,
                                    dish: orders[order].dish,
                                    rest_name: orders[order].rest_name,
                                    price: orders[order].price,
                                    check_no: orders[order].check_no,
                                    delivered: orders[order].delivered,
                                    ordered_date: orders[order].ordered_date
                                };
                                result.push(record);
                            }
                        }
                        res.json(result);
                    });
                }
            }
        });
});
//Get delivered orders for user
router.get('/api/userdelivers', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    Deliver.getDelivers(function(err, delivers){
                        if (err) return next(err);
                        result = [];
                        for(var deliver in delivers){
                            if(delivers[deliver].username === user.username){
                                var record = {
                                    _id: delivers[deliver]._id,
                                    username: delivers[deliver].username,
                                    address: delivers[deliver].address,
                                    dish: delivers[deliver].dish,
                                    rest_name: delivers[deliver].rest_name,
                                    price: delivers[deliver].price,
                                    check_no: delivers[deliver].check_no,
                                    deliver_date: delivers[deliver].deliver_date,
                                    order_date: delivers[deliver].order_date
                                };
                                result.push(record);
                            }
                        }
                        res.json(result);
                    });
                }
            }
        });
});

//contact us
router.post('/api/contactus', function(req, res, next){
    if(req.body.sender && req.body.subject && req.body.content){
        var message = {
            sender: req.body.sender,
            subject: req.body.subject,
            content: req.body.content
        }
        Inbox.addMessage(message, function(err, message){
            if(err) return next(err);
            res.json('Your message has been successfully!');
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }

});

// GET for logout logout
router.get('/api/userlogout', function (req, res, next) {
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