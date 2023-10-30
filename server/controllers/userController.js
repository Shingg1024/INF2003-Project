const db = require('../dataset/db'); // Import your database connection

// Define a function to get all users
exports.getAllUsers = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT * FROM user";
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            // Process the query results
            res.send(result);

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};
