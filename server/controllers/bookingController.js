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

        const query = "SELECT 'hostel' AS booking_type, booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? UNION SELECT 'restaurant' AS booking_type, booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? ORDER BY date_start DESC";
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

exports.getAllHostelByUserId = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? ORDER BY date_start desc";
        connection.query(query, [id], (err, result) => {
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

exports.getRestaurantByUserId = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? ORDER BY date DESC;";
        connection.query(query, [id], (err, result) => {
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

exports.getHostelCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT bh.booking_hostel_id, h.hostel_id, h.hostel_name, DATE_FORMAT(bh.date_start, '%Y-%m-%d') AS formatted_date, DATE_FORMAT(bh.date_end, '%Y-%m-%d') AS formatted_date_end FROM hostel AS h JOIN booking_hostel AS bh ON h.hostel_id = bh.hostel_id WHERE bh.date_start < CURDATE() AND bh.user_id = ? ORDER BY bh.date_start DESC;";
        connection.query(query, [id], (err, result) => {
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

exports.getHostelUpcoming = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT bh.booking_hostel_id, h.hostel_id, h.hostel_name, DATE_FORMAT(bh.date_start, '%Y-%m-%d') AS formatted_date, DATE_FORMAT(bh.date_end, '%Y-%m-%d') AS formatted_date_end FROM hostel AS h JOIN booking_hostel AS bh ON h.hostel_id = bh.hostel_id WHERE bh.date_start > CURDATE() AND bh.user_id = ? ORDER BY bh.date_start DESC;";
        connection.query(query, [id], (err, result) => {
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

exports.getRestaurantCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT br.booking_restaurant_id ,r.restaurant_id, r.restaurant_name, DATE_FORMAT(br.date, '%Y-%m-%d') AS formatted_date, br.time FROM restaurant AS r JOIN booking_restaurant AS br ON r.restaurant_id = br.restaurant_id WHERE br.date < CURDATE() AND br.user_id = ? ORDER BY br.date DESC;";
        connection.query(query, [id], (err, result) => {
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

exports.getRestaurantUpcoming = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;


        const query = "SELECT br.booking_restaurant_id ,r.restaurant_id, r.restaurant_name, DATE_FORMAT(br.date, '%Y-%m-%d') AS formatted_date, br.time FROM restaurant AS r JOIN booking_restaurant AS br ON r.restaurant_id = br.restaurant_id WHERE br.date < CURDATE() AND br.user_id = ? ORDER BY br.date DESC;";
        connection.query(query, [id], (err, result) => {
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

exports.getHostelAndRestaurantCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT 'hostel' AS booking_type, booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? AND date_start < CURDATE()  UNION SELECT 'restaurant' AS booking_type, booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? AND date < CURDATE()  ORDER BY date_start DESC;";
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

exports.getHostelAndRestaurantUpcoming = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT 'hostel' AS booking_type, booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? AND date_start > CURDATE() UNION SELECT 'restaurant' AS booking_type, booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? AND date > CURDATE() ORDER BY date_start DESC;";
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

// Add new hostel booking
exports.addHostelBooking = (req, res) => {
    //console.log(req.body);

    const id = req.body.user_id;
    const hostelId = req.body.hostelId;
    const bookingId = req.body.bookingId;
    const checkInDate = req.body.date_start;
    const checkOutDate = req.body.date_end;

    db.getConnection((err, connection) => {
        try {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            const query = "INSERT INTO booking_hostel (booking_hostel_id, user_id, hostel_id, date_start, date_end) VALUES (?, ?, ?, ?, ?);";
            connection.query(query, [bookingId, id, hostelId, checkInDate, checkOutDate], (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                console.log("------------- SQL query used: " + query + " -------------");
                res.status(200).json({ success: true, message: 'Booking successful' });
            });
        } finally {
            db.releaseConnection(connection);
        }
    });
};

exports.addRestaurantBooking = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const id = req.body.user_id;
        const restaurant_id = req.body.restaurant_id;
        const bookingId = req.body.bookingId;
        const date = req.body.date;
        const time = req.body.time;

        //console.log(req);

        const query = "INSERT INTO booking_restaurant (booking_restaurant_id, user_id, restaurant_id, date, time) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [bookingId, id, restaurant_id, date, time], (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                console.log("------------- SQL query used: " + query + " -------------");
                res.status(200).json({ success: true, message: 'Booking successful' });
            } finally {
                db.releaseConnection(connection);
            }
        });

    });
};