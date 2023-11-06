const db = require('../dataset/db'); // Import your database connection
const userModel = require('../models/userModel');

// Get all users
exports.getAllUsers = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT * FROM user";
        connection.query(query, (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                // Process the query results
                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                // Release the connection back to the pool when you're done
                db.releaseConnection(connection);
            }
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

        const query = "SELECT * FROM user where email = ? and password = ?";
        connection.query(query, [email, password], (err, results) => {
            try {
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
                console.log("------------- SQL query used: " + query + " -------------");

                // Retrieve the user_id from the SQL data
                const id = req.session.user.user_id;

                // Use the user_id to query the NoSQL data
                userModel.findOne({
                    user_id: id
                }).then((result) => {
                    if (result) {
                        // Map and merge the NoSQL result with the existing SQL user data
                        req.session.user = {
                            user_id: req.session.user.user_id, // Keep the SQL user_id
                            email: req.session.user.email,     // Map SQL email to NoSQL email
                            firstName: req.session.user.firstName, // Map SQL firstname to NoSQL firstname
                            lastName: req.session.user.lastName,   // Map SQL lastName to NoSQL lastName
                            profile: {
                                biography: result.profile.biography,
                                interests: result.profile.interests,
                                socialMedia: {
                                    twitter: result.profile.socialMedia.twitter,
                                    instagram: result.profile.socialMedia.instagram,
                                    facebook: result.profile.socialMedia.facebook
                                }
                            }
                        };

                        console.log("------------- MongoDB query used: userModel.findOne({ user_id: id }) -------------");
                        res.redirect('/');
                    } else {
                        res.redirect('/');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } finally {
                // Release the connection back to the pool when you're done
                db.releaseConnection(connection);
            }
        });
    });
};

// Register
exports.regUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const selectQuery = "SELECT * FROM user where email = ?";
        connection.query(selectQuery, [email], (err, results) => {
            if (err) {
                console.log(err);
                db.releaseConnection(connection);
                return res.status(500).json({ error: 'An error occurred' });
            }

            if (results.length == 0) {
                const insertQuery = "INSERT INTO user (email, password, firstName, lastName) VALUES (?, ?, ?, ?)";
                connection.query(insertQuery, [email, password, firstName, lastName], (err, results) => {
                    if (err) {
                        db.releaseConnection(connection);
                        console.log(err);
                        return res.status(500).json({ error: 'An error occurred during registration.' });
                    }

                    db.releaseConnection(connection);
                    return res.status(200).json({ message: 'User registered successfully.' });
                });
            } else {
                db.releaseConnection(connection);
                return res.status(400).json({ error: 'User with that email already exists.' });
            }
        });
    });
};


// Update Profile
exports.editUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    db.getConnection((err, connection) => {
        try {
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

                console.log("------------- SQL query used: " + query + " -------------");
            });
        } finally {
            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        }
    });

    // Update the NoSQL (MongoDB) data
    const id = req.session.user.user_id;
    try {
        const updatedUser = await userModel.findOneAndUpdate(
            { user_id: id },
            {
                $set: {
                    'profile.biography': req.body.biography,
                    'profile.interests': req.body.interests,
                    'profile.socialMedia.twitter': req.body.twitter,
                    'profile.socialMedia.instagram': req.body.instagram,
                    'profile.socialMedia.facebook': req.body.facebook,
                }
            },
            { new: true, upsert: true }
        );

        req.session.user = {
            user_id: req.session.user.user_id,
            email: email || req.session.user.email,
            firstName: firstName || req.session.user.firstName,
            lastName: lastName || req.session.user.lastName,
            profile: {
                biography: updatedUser.profile.biography,
                interests: updatedUser.profile.interests,
                socialMedia: {
                    twitter: updatedUser.profile.socialMedia.twitter,
                    instagram: updatedUser.profile.socialMedia.instagram,
                    facebook: updatedUser.profile.socialMedia.facebook
                }
            }
        };

        console.log("------------- MongoDB query used: userModel.findOneAndUpdate(" +
            "{ user_id: id },{$set: {'profile.biography': req.body.biography,'profile.interests': req.body.interests, " +
            "'profile.socialMedia.twitter': req.body.twitter, " +
            "'profile.socialMedia.instagram': req.body.instagram, " +
            "'profile.socialMedia.facebook': req.body.facebook,}}, " +
            "{ new: true, upsert: true }) -------------"
        );

        res.redirect('/edit');
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

exports.sortData = (req, res) => {
    db.getConnection((err, connection) => {
        try {
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
            });
        } finally {
            // Release the connection back to the pool when you're done
            db.releaseConnection(connection);
        }
    });
};

exports.delete = (req, res) => {
    db.getConnection((err, connection) => {
        try {
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
                console.log("------------- SQL query used: " + deleteQuery + " -------------");

                if (result.affectedRows === 0) {
                    // No item with the provided ID found
                    return res.status(404).json({ error: 'Item not found' });
                }

                return res.status(200).json({ message: 'Item deleted successfully' });
            });
        } finally {
            db.releaseConnection(connection);
        }
    });
};

exports.rankcountFirstName = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "WITH NameCounts AS (SELECT firstName ,COUNT(*) AS NameCount FROM user GROUP BY firstName)" +
            "SELECT firstName, NameCount, RANK() OVER (ORDER BY NameCount DESC) AS NameRank FROM NameCounts ORDER BY NameRANK";

        connection.query(query, (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                // Process the query results
                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                // Release the connection back to the pool when you're done
                db.releaseConnection(connection);
            }
        });
    });
};

exports.denseRankcountFirstName = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        const query = "WITH NameCounts AS (SELECT firstName ,COUNT(*) AS NameCount FROM user GROUP BY firstName)" +
            "SELECT firstName, NameCount, DENSE_RANK() OVER (ORDER BY NameCount DESC) AS NameRank FROM NameCounts ORDER BY NameRANK";

        connection.query(query, (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                // Process the query results
                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                // Release the connection back to the pool when you're done
                db.releaseConnection(connection);
            }
        });
    });
};