const mongoose = require('mongoose');

//Check Schema
var inboxSchema = mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    send_date:{
    type: Date,
    default: Date.now
    } 
});

//Get all messages
inboxSchema.statics.getMessages = function(callback, limit){
    Inbox.find(callback).limit(limit);
}
//Get single message by ID
inboxSchema.statics.getMessageById = function(id, callback){
    Inbox.findById(id, function(err, message){
        if (err){
            return callback(err);
        }else if (!message){
            return callback(null, 'no message found');
        }
        return callback(null, message);
    });
}
//Add new message
inboxSchema.statics.addMessage = function(message, callback){
    Inbox.create(message, function (err, message){
        if(err){
            return callback(err);
        }
        return callback(null, message);
    });
}
//Remove message
inboxSchema.statics.removeMessage = function(id, callback){
    var query = {_id: id};
    Inbox.remove(query, callback);
}

var Inbox = mongoose.model('Inbox', inboxSchema);
module.exports = Inbox;