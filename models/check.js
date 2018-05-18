const mongoose = require('mongoose');

//Check Schema
var checkSchema = mongoose.Schema({
    check_no:{
        type: Number,
        unique: true,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    dish:{
        type: String,
        required: true
    },
    rest_name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    buy_date:{
    type: Date,
    default: Date.now
    } 
});

//Get all checks
checkSchema.statics.getChecks = function(callback, limit){
    Check.find(callback).limit(limit);
}
//Get single check by ID
checkSchema.statics.getCheckById = function(id, callback){
    Check.findById(id, function(err, check){
        if (err){
            return callback(err);
        }else if (!check){
            return callback(null, 'no check found');
        }
        return callback(null, check);
    });
}
//Get single check by Check No
checkSchema.statics.getCheckByNo = function(no, callback){
    Check.findOne({ check_no: no })
        .exec(function (err, check) {
            if (err) {
                return callback(err)
            } else if (!check) {
                var err = new Error('Check not found.');
                err.status = 401;
                err.errmsg = 'Check No: ' + no + ' not found';
                return callback(err);
            }
            return callback(null, check);
        });
}
//Add new Check
checkSchema.statics.addCheck = function(check, callback){
    Check.create(check, function (err, check){
        if(err){
            return callback(err);
        }
        //console.log(check);
        return callback(null, check);
    });
}

//Remove Check
checkSchema.statics.removeCheck = function(id, callback){
    var query = {_id: id};
    Check.remove(query, callback);
}

var Check = mongoose.model('Check', checkSchema);
module.exports = Check;