const mongoose = require("mongoose");
const hostelModel = require('../../server/models/hostelModel');
const resModel = require('../../server/models/restaurantModel');

async function addLocationField() {
    const cursor = hostelModel.find({}).cursor();
    const cursor1 = resModel.find({}).cursor();

    for await (const doc of cursor) {
        const location = {
            type: "Point",
            coordinates: [doc.longitude, doc.latitude],
        };

        // Update the document with the new "location" field
        await hostelModel.updateOne({ _id: doc._id }, { location });
    }

    for await (const doc of cursor1) {
        const location = {
            type: "Point",
            coordinates: [doc.longitude, doc.latitude],
        };

        await resModel.updateOne({ restaurant_id: doc.restaurant_id }, { location });
    }
}

// Connect to your MongoDB
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // Call the function to add and populate the "location" field
        console.log("Adding now...")
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