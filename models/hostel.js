const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostelSchema = new Schema({
    hostelname: String,
    city: String,
    price: Number,
    distance: String,
    summaryScore: Number,
    rating: String,
    atmosphereScore: Number,
    cleanlinessScore: Number,
    facilitiesScore: Number,
    securityScore: Number,
    staffScore: Number,
    valueformoneyScore: Number,
    lon: Number,
    lat: Number
});

// Create a model for the hotel collection
const hostel = mongoose.model('hostel', hostelSchema);

module.exports = hostel;