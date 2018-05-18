const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Users Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

//authenticate input against database
userSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

//find all users
userSchema.statics.getUsers = function (callback, limit){
    User.find(callback).limit(limit);
}
//find user by id
userSchema.statics.getUserById = function(id, callback){
    User.findById(id, callback);
}
//update user
userSchema.statics.updateUser = function(id, user, options, callback){
    var query = {_id: id};
    var update = {
        //username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        password: bcrypt.hashSync(user.password)
    }
    User.findOneAndUpdate(query, update, options, callback);
}
// delete user by Id
userSchema.statics.removeUser = function(id, callback){
    var query = {_id: id};
    User.remove(query, callback);
}

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', userSchema);
module.exports = User;