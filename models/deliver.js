const mongoose = require('mongoose');

//Delivered Dishes Schema
var deliverSchema = mongoose.Schema({
    dish:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    rest_name:{
        type: String,
        required: true
    },
    check_no:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    order_date:{
        type: Date,
        required: true
    },
    delivered:{
        type: Boolean,
        required: true
    },
    deliver_date:{
    type: Date,
    default: Date.now
    } 
});

//Get delivered dishes
deliverSchema.statics.getDelivers = function(callback, limit){
    Deliver.find(callback).limit(limit);
}
//Get single deliver
deliverSchema.statics.getDeliverById = function(id, callback){
    Deliver.findById(id, callback);
}
//Add new Deliver
deliverSchema.statics.addDeliver = function(deliver, callback){
    Deliver.create(deliver, callback);
}

//Remove Deliver
deliverSchema.statics.removeDeliver = function(id, callback){
    var query = {_id: id};
    Deliver.remove(query, callback);
}

var Deliver = mongoose.model('Deliver', deliverSchema);
module.exports = Deliver;