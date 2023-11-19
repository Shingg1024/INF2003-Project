const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurant_id: Number,
    name: String,
    japaneseName: String,
    station: String,
    firstCategory: String,
    secondCategory: String,
    dinnerPrice: String,
    lunchPrice: String,
    latitude: Number,
    longitude: Number,
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    }
});
restaurantSchema.index({ location: "2dsphere" });

const restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = restaurant;