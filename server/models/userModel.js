const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: Number,
    profile:{
        biography: String,
        interests: String,
        socialMedia:{
            twitter: String,
            instagram: String,
            facebook: String
        }
    },
});

// Create a model for the restaurant collection
const user = mongoose.model('user', userSchema);

module.exports = user;