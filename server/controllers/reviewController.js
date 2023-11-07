const db = require('../dataset/db');

// Get all users
exports.getReview = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        id = req.params.id;

        const query = "SELECT * FROM review_hostel where user_id = ? UNION SELECT * FROM review_restaurant where user_id = ?";
        connection.query(query, [id,id], (err, result) => {
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