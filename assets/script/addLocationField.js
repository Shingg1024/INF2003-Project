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
            coordinates: [doc.long, doc.lat],
        };

        // Update the document with the new "location" field
        await resModel.updateOne({ _id: doc._id }, { location });
    }
}

// Connect to your MongoDB
mongoose.connect("mongodb+srv://admin:root@shingapi.uhgdqub.mongodb.net/INF2003?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
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
