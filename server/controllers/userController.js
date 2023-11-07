const db = require('../dataset/db');
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

                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
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
                    connection.release();
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                req.session.user = results[0];
                console.log("------------- SQL query used: " + query + " -------------");

                const id = req.session.user.user_id;

                userModel.findOne({
                    user_id: id
                }).then((result) => {
                    if (result) {
                        req.session.user = {
                            user_id: req.session.user.user_id,
                            email: req.session.user.email,
                            firstName: req.session.user.firstName,
                            lastName: req.session.user.lastName,
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

            const updateFields = [];
            const updateValues = [];

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

            const setClause = updateFields.join(', ');

            const query = `UPDATE user SET ${setClause} WHERE user_id = ?`;
            updateValues.push(req.session.user.user_id);

            connection.query(query, updateValues, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                if (email) req.session.user.email = email;
                if (firstName) req.session.user.firstName = firstName;
                if (lastName) req.session.user.lastName = lastName;

                console.log("------------- SQL query used: " + query + " -------------");
            });
        } finally {
            db.releaseConnection(connection);
        }
    });

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

                res.json(result);
                console.log("------------- SQL query used: " + query + " -------------");
            });
        } finally {
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

                console.log("------------- SQL query used: " + deleteQuery + " -------------");

                if (result.affectedRows === 0) {
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

                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
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

                res.send(result);
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                db.releaseConnection(connection);
            }
        });
    });
};

exports.rankcountReview = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "WITH CombinedReviewCounts AS (" +
            "SELECT user_id, COUNT(*) AS total_review_count " +
            "FROM (SELECT user_id FROM review_hostel UNION ALL SELECT user_id FROM review_restaurant) AS Combined " +
            "GROUP BY user_id) " +
            "SELECT u.email, c.user_id, total_review_count, RANK() OVER(ORDER BY total_review_count DESC) AS user_rank " +
            "FROM CombinedReviewCounts c " +
            "INNER JOIN user u ON c.user_id = u.user_id " +
            "ORDER BY user_rank ";

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

exports.denseRankcountReview = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "WITH CombinedReviewCounts AS (" +
            "SELECT user_id, COUNT(*) AS total_review_count " +
            "FROM (SELECT user_id FROM review_hostel UNION ALL SELECT user_id FROM review_restaurant) AS Combined " +
            "GROUP BY user_id) " +
            "SELECT u.email, c.user_id, total_review_count, DENSE_RANK() OVER(ORDER BY total_review_count DESC) AS user_rank " +
            "FROM CombinedReviewCounts c " +
            "INNER JOIN user u ON c.user_id = u.user_id " +
            "ORDER BY user_rank ";

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
