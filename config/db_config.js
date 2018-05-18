var mongoose = require('mongoose');

//connect to MongoDB
//mongoose.connect('mongodb://localhost/food_system_db');
mongoose.connect('mongodb://nechir:12341234@ds121299.mlab.com:21299/food_system_db')
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

module.exports = db;
