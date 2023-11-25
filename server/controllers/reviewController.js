const db = require('../dataset/db');

// Get all users
exports.getReview = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT * FROM review_hostel JOIN booking_hostel ON review_hostel.booking_hostel_id = booking_hostel.booking_hostel_id where review_hostel.user_id = ?";
        connection.query(query, id, (err, hostelResults) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                const queryRestaurant = "SELECT * FROM review_restaurant JOIN booking_restaurant ON review_restaurant.booking_restaurant_id = booking_restaurant.booking_restaurant_id where review_restaurant.user_id = ?";

                connection.query(queryRestaurant, id, (err, restaurantResults) => {
                    try {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: 'An error occurred' });
                        }

                        const dataObj = {
                            hostels: hostelResults,
                            restaurants: restaurantResults
                        };

                        console.log("------------- SQL query used: " + query + " -------------");
                        console.log("------------- SQL query used: " + queryRestaurant + " -------------");

                        res.send(dataObj);
                    } finally {
                        db.releaseConnection(connection);
                    }
                });
            } finally {
                db.releaseConnection(connection);
            }
        });
    });
};

exports.submitHostelReview = (req, res) => {

    user_id = req.body.user_id;
    booking_hostel_id = req.body.booking_hostel_id;
    booking_restaurant_id = req.body.booking_restaurant_id;
    review_comments = req.body.review_comments;
    reviewpoints = req.body.reviewpoints;

    //console.log(req.body)
    db.getConnection((err, connection) => {
        try {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            if (booking_hostel_id != null) {
                const selectQuery = "SELECT * FROM review_hostel where booking_hostel_id = ?";
                connection.query(selectQuery, [booking_hostel_id], (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'An error occurred' });
                    }

                    if (results.length == 0) {
                        const insertQuery = "INSERT INTO review_hostel (user_id, booking_hostel_id, review_comment, review_rating) VALUES (?, ?, ?, ?)";
                        connection.query(insertQuery, [user_id, booking_hostel_id, review_comments, reviewpoints], (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ error: 'An error occurred during registration.' });
                            }
                            console.log("------------- SQL query used: " + insertQuery + " -------------");
                            res.redirect('/review');
                        });
                    } else {
                        return res.status(400).json({ error: 'Review already exist' });
                    }
                });
            } else if (booking_restaurant_id != null) {
                const selectQuery = "SELECT * FROM review_restaurant where booking_restaurant_id = ?";
                connection.query(selectQuery, [booking_restaurant_id], (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: 'An error occurred' });
                    }

                    if (results.length == 0) {
                        const insertQuery = "INSERT INTO review_restaurant (user_id, booking_restaurant_id, review_comment, review_rating) VALUES (?, ?, ?, ?)";
                        connection.query(insertQuery, [user_id, booking_restaurant_id, review_comments, reviewpoints], (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ error: 'An error occurred during registration.' });
                            }
                            console.log("------------- SQL query used: " + insertQuery + " -------------");
                            res.redirect('/review');
                        });
                    } else {
                        return res.status(400).json({ error: 'Review already exist' });
                    }
                });
            }
        } finally {
            db.releaseConnection(connection);
        }
    });
};