const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Managers Schema
var mgrSchema = mongoose.Schema({
    mgr_name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rest_name:{
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
    create_date: {
        type: Date,
        default: Date.now
    }
});

//authenticate input against database
mgrSchema.statics.authenticate = function (mgr_name, password, callback) {
    Manager.findOne({ mgr_name: mgr_name })
        .exec(function (err, manager) {
            if (err) {
                return callback(err)
            } else if (!manager) {
                var err = new Error('Manager not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, manager.password, function (err, result) {
                if (result === true) {
                    return callback(null, manager);
                } else {
                    return callback();
                }
            });
        });
}
//find all managers
mgrSchema.statics.getManagers = function (callback, limit){
    Manager.find(callback).limit(limit);
}
//find manager by id
mgrSchema.statics.getManagerById = function(id, callback){
    Manager.findById(id, callback);
}
//update manager
mgrSchema.statics.updateManager = function(id, manager, options, callback){
    var query = {_id: id};
    var update = {
        //mgr_name: manager.mgr_name,
        //rest_name: manager.rest_name,
        first_name: manager.first_name,
        last_name: manager.last_name,
        password: bcrypt.hashSync(manager.password)
    }
    Manager.findOneAndUpdate(query, update, options, callback);
}
// delete manager by Id
mgrSchema.statics.removeManager = function(id, callback){
    var query = {_id: id};
    Manager.remove(query, callback);
}
//hashing a password before saving it to the database
mgrSchema.pre('save', function (next) {
    var manager = this;
    bcrypt.hash(manager.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        manager.password = hash;
        next();
    })
});

var Manager = mongoose.model('Manager', mgrSchema);
module.exports = Manager;