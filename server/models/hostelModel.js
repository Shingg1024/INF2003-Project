const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostelSchema = new Schema({
    hostel_id: Number,
    hostel_name: String,
    hostel_link: String,
    city: String,
    price: Number,
    free: [String],
    general: [String],
    services: [String],
    foodDrink: [String],
    entertainment: [String],
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
hostelSchema.index({ location: "2dsphere" });

// Create a model for the hotel collection
const hostel = mongoose.model('hostel', hostelSchema);

module.exports = hostel;