const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Admin Schema
var adminSchema = mongoose.Schema({
    admin: {
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
    }
});

//authenticate input against database
adminSchema.statics.authenticate = function (admin_name, password, callback) {
    Admin.findOne({ admin: admin_name })
        .exec(function (err, admin) {
            if (err) {
                return callback(err)
            } else if (!admin) {
                var err = new Error('You should not be here!');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, admin.password, function (err, result) {
                if (result === true) {
                    return callback(null, admin);
                } else {
                    return callback();
                }
            });
        });
}
//hashing a password before saving it to the database
adminSchema.pre('save', function (next) {
    var admin = this;
    bcrypt.hash(admin.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        admin.password = hash;
        next();
    })
});

var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;