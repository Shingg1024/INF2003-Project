const restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = (req, res) => {
    restaurant.find().then((result) => {
        console.log("------------- MongoDB query used: restaurant.find() -------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
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

// Get restaurant booking count
exports.getRestaurantBookingCount = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT COUNT(*) AS num FROM booking_restaurant";
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
};


exports.addRestaurantBooking = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        id = req.params.id;
        restaurantId = req.params.restaurantId;
        bookingId = req.params.bookingId;
        date = req.params.date;
        time = req.params.time;

        //const { bookingId, id, restaurantId, date, time } = req.body;

        const query = "INSERT INTO booking_restaurant (booking_restaurant_id, user_id, restaurant_id, date, time) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [bookingId, id, restaurantId, date, time], (err, result) => {
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
};