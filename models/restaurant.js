const mongoose = require('mongoose');

//Restaurant Schema
var restaurantSchema = mongoose.Schema({
    rest_name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    } 
});

//Get Restaurants
restaurantSchema.statics.getRestaurants = function(callback, limit){
    Restaurant.find(callback).limit(limit);
}
//Get single Restaurant
restaurantSchema.statics.getRestaurantById = function(id, callback){
    Restaurant.findById(id, callback);
}
//Add new Restaurant
restaurantSchema.statics.addRestaurant = function(restaurant, callback){
    Restaurant.create(restaurant, callback);
}
//Update Restaurant
restaurantSchema.statics.updateRestaurant = function(id, restaurant, options, callback){
    var query = {_id: id};
    var update = {
        rest_name: restaurant.rest_name,
        address: restaurant.address
    }
    Restaurant.findOneAndUpdate(query, update, options, callback);
}
//Remove Restaurant
restaurantSchema.statics.removeRestaurant = function(id, callback){
    var query = {_id: id}
    Restaurant.remove(query, callback);
}

var Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;