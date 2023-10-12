const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: String,
    japaneseName: String,
    station: String,
    firstCategory: String,
    secondCategory: String,
    dinnerPrice: String,
    lunchPrice: String,
    totalRating: Number,
    dinnerRating: Number,
    lunchRating: Number,
    reviewNum: Number,
    lat: Number,
    long: Number,
});

// Create a model for the restaurant collection
const restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = restaurant;