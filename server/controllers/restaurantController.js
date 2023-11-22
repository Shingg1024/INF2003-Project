const restaurant = require('../models/restaurantModel');
const db = require('../dataset/db');

exports.getAllRestaurants = (req, res) => {
    restaurant.find().then((result) => {
        console.log("------------- MongoDB query used: restaurant.find() -------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.allrestaurantSQL = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT * FROM restaurant";
        connection.query(query, (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                db.releaseConnection(connection);
            }
        });
    });
}

exports.getRes = (req, res) => {
    restaurant.find({
        restaurant_id: req.params.id
    }).then((result) => {
        console.log("------------- MongoDB query used: restaurant.find({restaurant_id: req.param.id}) -------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.nearbyRes = async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const nearbyRestaurants = await restaurant.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: 5000,
                },
            },
        }).limit(10).lean();

        console.log("------------- MongoDB query used: restaurant.find({location: {$near: {$geometry: {type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)],},"
            + "$maxDistance: 5000, }, }, "
            + "}).limit(10).lean();  -------------");
        res.json(nearbyRestaurants);
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
