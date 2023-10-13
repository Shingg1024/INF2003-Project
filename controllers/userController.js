const db = require('../db'); // Import your database connection

// Define a function to get all users
exports.getAllUsers = (req, res) => {
    const query = "SELECT * FROM user";
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        res.send(result);
    });
};
