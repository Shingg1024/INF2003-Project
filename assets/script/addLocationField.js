const mongoose = require('mongoose');
const hostelModel = require('../../server/models/hostelModel'); 
const resModel = require('../../server/models/restaurantModel');

async function addLocationField() {
    const cursor = hostelModel.find({}).cursor();
    const cursor1 = resModel.find({}).cursor();

    for await (const doc of cursor) {
        const location = {
            type: 'Point',
            coordinates: [doc.longitude, doc.latitude],
        };

        await hostelModel.updateOne(
            { _id: doc._id },
            { $set: { location: { type: 'Point', coordinates: location.coordinates } } }
        );
    }

    for await (const doc of cursor1) {
        const location = {
            type: 'Point',
            coordinates: [doc.longitude, doc.latitude],
        };

        await resModel.updateOne(
            { restaurant_id: doc.restaurant_id },
            { $set: { location: { type: 'Point', coordinates: location.coordinates } } }
        );
    }
}

mongoose.connect("mongodb+srv://admin:root@shingapi.uhgdqub.mongodb.net/INF2003?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

addLocationField().then(() => {
    console.log('Location fields added successfully.');
    mongoose.connection.close();
}).catch(error => {
    console.error('Error adding location fields:', error);
    mongoose.connection.close();
});
