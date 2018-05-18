var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var errorHandler = require('errorhandler');

var app = express();

//Database Configuration
var db = require('./config/db_config');

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from template
app.use(express.static(__dirname + ''));

// include routes
app.use('/', require('./routes/users.js'));
app.use('/', require('./routes/managers.js'));
app.use('/', require('./routes/administration.js'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
app.use(errorHandler());

// listen on port 3030
var port = process.env.PORT || 3030
app.listen(port, function () {
  console.log('Express app listening on port:' + port);
});