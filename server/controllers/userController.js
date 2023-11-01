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

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

// Update Profile
exports.editUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;

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
        if (fname) {
            updateFields.push('fname = ?');
            updateValues.push(fname);
        }
        if (lname) {
            updateFields.push('lname = ?');
            updateValues.push(lname);
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
            if (fname) req.session.user.firstName = fname;
            if (lname) req.session.user.lastName = lname;

            // Redirect to a success page or profile page
            res.redirect('/edit'); // Change this URL to your actual profile page URL

            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        });
    });
};

