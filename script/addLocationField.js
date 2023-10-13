const mongoose = require("mongoose");
const hostelModel = require('../models/hostel');

async function addLocationField() {
    const cursor = hostelModel.find({}).cursor();

    for await (const doc of cursor) {
        const location = {
            type: "Point",
            coordinates: [doc.longitude, doc.latitude],
        };

        // Update the document with the new "location" field
        await hostelModel.updateOne({ _id: doc._id }, { location });
    }
}

// Connect to your MongoDB
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Call the function to add and populate the "location" field
        addLocationField()
            .then(() => {
                console.log("Location fields added to documents.");
                mongoose.disconnect();
            })
            .catch((err) => {
                console.error("Error:", err);
                mongoose.disconnect();
            });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
