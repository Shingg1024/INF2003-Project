const db = require('../dataset/db'); // Import your database connection

// Get all users
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
            console.log("------------- SQL query used: " + query + " -------------");

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

// Login
exports.loginUser = (req, res) => {
    email = req.body.email;
    password = req.body.password;

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT * FROM user where email = ?";
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            if (results.length === 0) {
                // No user with the provided email found
                connection.release();
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            req.session.user = results[0];
            // Process the query results
            res.redirect('/');

            console.log("------------- SQL query used: " + query + " -------------");

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

// Update Profile
exports.editUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        // Initialize an array to store the fields to update and their corresponding values
        const updateFields = [];
        const updateValues = [];

        // Check if each field is not blank and add it to the update array
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (password) {
            updateFields.push('password = ?');
            updateValues.push(password);
        }
        if (firstName) {
            updateFields.push('firstName = ?');
            updateValues.push(firstName);
        }
        if (lastName) {
            updateFields.push('lastName = ?');
            updateValues.push(lastName);
        }

        // Create the SET clause for the SQL query
        const setClause = updateFields.join(', ');

        // You should update the user's information in the database
        const query = `UPDATE user SET ${setClause} WHERE user_id = ?`; // Assuming there's a user_id for the user
        updateValues.push(req.session.user.user_id);

        connection.query(query, updateValues, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            // Update the session user with the new information
            if (email) req.session.user.email = email;
            if (firstName) req.session.user.firstName = firstName;
            if (lastName) req.session.user.lastName = lastName;

            // Redirect to a success page or profile page
            res.redirect('/edit'); // Change this URL to your actual profile page URL

            console.log("------------- SQL query used: " + query + " -------------");

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

exports.sortData = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const sortingParameter = req.query.parameter;
        const sortOrder = req.query.order;
        const query = `SELECT * FROM user ORDER BY ${sortingParameter} ${sortOrder}`;

        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            // Process the query results
            res.json(result);
            console.log("------------- SQL query used: " + query + " -------------");

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

exports.delete = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const itemId = req.params.id;

        const deleteQuery = 'DELETE FROM user WHERE user_id = ?';


        connection.query(deleteQuery, [itemId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            // Process the query results
            console.log("------------- SQL query used: " + query + " -------------");

            if (result.affectedRows === 0) {
                // No item with the provided ID found
                return res.status(404).json({ error: 'Item not found' });
            }

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);

            return res.status(200).json({ message: 'Item deleted successfully' });
        });
    });
};
