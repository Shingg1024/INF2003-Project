const db = require('../dataset/db');
const hostel = require('../models/hostelModel');
const restaurant = require('../models/restaurantModel');
const { getAllUsers } = require('./userController');

// Get all users
exports.getBooking = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT * FROM booking_hostel where user_id = ? UNION SELECT * FROM booking_restaurant where user_id = ?";
        connection.query(query, [id, id], (err, result) => {
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

// Get hostel booking count
exports.getHostelBookingCount = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT COUNT(*) AS num FROM booking_hostel";
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

//Add new hostel booking
exports.addHostelBooking = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        id = req.params.id;
        hostelId = req.params.hostelId;
        bookingId = req.params.bookingId;
        checkInDate = req.params.checkInDate;
        checkOutDate = req.params.checkOutDate;

        //const { bookingId, id, hostelId, checkInDate, checkOutDate } = req.body;

        const query = "INSERT INTO booking_hostel (booking_hostel_id, user_id, hostel_id, date_start, date_end) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [bookingId, id, hostelId, checkInDate, checkOutDate], (err, result) => {
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