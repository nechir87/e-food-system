const mongoose = require('mongoose');

//Ordered order Schema
var orderSchema = mongoose.Schema({
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
    delivered:{
        type: Boolean,
        required: true
    },
    ordered_date:{
    type: Date,
    default: Date.now
    } 
});

//Get all oreders
orderSchema.statics.getOrders = function(callback, limit){
    Order.find(callback).limit(limit);
}
//Get single order
orderSchema.statics.getOrderById = function(id, callback){
    Order.findById(id, callback);
}
//Add new Order
orderSchema.statics.addOrder = function(order, callback){
    Order.create(order, callback);
}

//Remove order
orderSchema.statics.removeOrder = function(id, callback){
    var query = {_id: id};
    Order.remove(query, callback);
}

var Order = mongoose.model('Order', orderSchema);
module.exports = Order;