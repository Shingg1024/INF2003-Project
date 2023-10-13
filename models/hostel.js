const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostelSchema = new Schema({
    hostel_id: Number,
    hostel_name: String,
    hostel_link: String,
    city: String,
    price: Number,
    distance: Number,
    summary_score: Number,
    rating_band: String,
    value_for_money: Number,
    security: Number,
    locationScore: Number,
    staff: Number,
    atmosphere: Number,
    cleanliness: Number,
    facilities: Number,
    free: String,
    general: String,
    services: String,
    foodDrink: String,
    entertainment: String,
    latitude: Number,
    longitude: Number,
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: [Number], // Array for [longitude, latitude]
    }
});
hostelSchema.index({ location: "2dsphere" });

// Create a model for the hotel collection
const hostel = mongoose.model('hostel', hostelSchema);

module.exports = hostel;