const mongoose = require('mongoose');

//Menu Schema
var menuSchema = mongoose.Schema({
    dish_name: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    rest_name: {
        type: String,
        required: true
    },
    mgr_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredient: {
        type: String,
        required: true
    },
    diabetes:{
        type: Boolean
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

//find all menu
menuSchema.statics.getDishes = function (callback, limit){
    Menu.find(callback).limit(limit);
}
//find dish by id
menuSchema.statics.getDishById = function(id, callback){
    Menu.findById(id, callback);
}
//Add new dish
menuSchema.statics.addDish = function(newMenu, callback){
    Menu.create(newMenu, function (err, menu){
        if(err){
            return callback(err);
        }
        return callback(null, menu);
    });
}
//update dish
menuSchema.statics.updateDish = function(id, dish, options, callback){
    var query = {_id: id};
    var update = {
        dish_name: dish.dish_name,
        img_url: dish.img_url,
        rest_name: dish.rest_name,
        mgr_name: dish.mgr_name,
        price: dish.price,
        diabetes: dish.diabetes,
        ingredient: dish.ingredient
    }
    Menu.findOneAndUpdate(query, update, options, callback);
}
// delete dish by Id
menuSchema.statics.removeDish = function(id, callback){
    var query = {_id: id};
    Menu.remove(query, callback);
}

var Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;