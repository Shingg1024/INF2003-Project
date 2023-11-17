const db = require('../dataset/db');

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

exports.getRestaurantByUserId = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? ORDER BY date DESC;";
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

exports.getHostelCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT *, DATE_FORMAT(date_start, '%Y-%m-%d') AS formatted_date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS formatted_date_end FROM booking_hostel WHERE date_start < DATE(CONCAT(YEAR(CURDATE()), '-01-01')) and user_id = 1 ORDER BY date_start DESC;";
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

exports.getHostelUpcoming = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT *, DATE_FORMAT(date_start, '%Y-%m-%d') AS formatted_date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS formatted_date_end FROM booking_hostel WHERE date_start > DATE(CONCAT(YEAR(CURDATE()), '-01-01')) and user_id = 1 ORDER BY date_start DESC;";
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

exports.getRestaurantCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT *, DATE_FORMAT(date, '%Y-%m-%d') AS formatted_date FROM booking_restaurant WHERE date < DATE(CONCAT(YEAR(CURDATE()), '-01-01')) and user_id = 1 ORDER BY date DESC;";
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

exports.getRestaurantUpcoming = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT *, DATE_FORMAT(date, '%Y-%m-%d') AS formatted_date FROM booking_restaurant WHERE date > DATE(CONCAT(YEAR(CURDATE()), '-01-01')) and user_id = 1 ORDER BY date DESC;";
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

exports.getHostelAndRestaurantCompleted = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT 'hostel' AS booking_type, booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? AND date_start < DATE(CONCAT(YEAR(CURDATE()), '-01-01')) UNION SELECT 'restaurant' AS booking_type, booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? AND date < DATE(CONCAT(YEAR(CURDATE()), '-01-01')) ORDER BY date_start DESC;";
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

        const query = "SELECT 'hostel' AS booking_type, booking_hostel_id, user_id, hostel_id, DATE_FORMAT(date_start, '%Y-%m-%d') AS date_start, DATE_FORMAT(date_end, '%Y-%m-%d') AS date_end FROM booking_hostel WHERE user_id = ? AND date_start > DATE(CONCAT(YEAR(CURDATE()), '-01-01')) UNION SELECT 'restaurant' AS booking_type, booking_restaurant_id, user_id, restaurant_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, time FROM booking_restaurant WHERE user_id = ? AND date > DATE(CONCAT(YEAR(CURDATE()), '-01-01')) ORDER BY date_start DESC;";
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