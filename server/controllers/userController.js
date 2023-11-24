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
                            first_name: req.session.user.first_name,
                            last_name: req.session.user.last_name,
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
        try {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            const selectQuery = "SELECT * FROM user where email = ?";
            connection.query(selectQuery, [email], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                if (results.length == 0) {
                    const insertQuery = "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
                    connection.query(insertQuery, [email, password, firstName, lastName], (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: 'An error occurred during registration.' });
                        }
                        console.log("------------- SQL query used: " + insertQuery + " -------------");
                        res.redirect('/login');
                    });
                } else {
                    return res.status(400).json({ error: 'User with that email already exists.' });
                }
            });
        } finally {
            db.releaseConnection(connection);
        }
    });
};


// Update Profile
exports.editUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

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
            if (first_name) {
                updateFields.push('first_name = ?');
                updateValues.push(first_name);
            }
            if (last_name) {
                updateFields.push('last_name = ?');
                updateValues.push(last_name);
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
                if (first_name) req.session.user.first_name = first_name;
                if (last_name) req.session.user.lastName = last_name;

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
            first_name: first_name || req.session.user.first_name,
            last_name: last_name || req.session.user.last_name,
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
exports.delete = async (req, res) => {
    const itemId = req.params.id;
    db.getConnection((err, connection) => {
        try {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred' });
            }

            const deleteQuery = 'DELETE FROM user WHERE user_id = ?';

            connection.query(deleteQuery, [itemId], async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                console.log("------------- SQL query used: " + deleteQuery + " -------------");

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Item not found' });
                }

                // Assuming userModel is a Mongoose model
                const deletedUser = await userModel.deleteOne({ user_id: itemId }).catch((err) => {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred while deleting from MongoDB' });
                });

                console.log("------------- MongoDB query used: userModel.deleteOne({ user_id: id }) -------------");
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

        const query = "WITH NameCounts AS (SELECT first_name ,COUNT(*) AS NameCount FROM user GROUP BY first_name)" +
            "SELECT first_name, NameCount, RANK() OVER (ORDER BY NameCount DESC) AS NameRank FROM NameCounts ORDER BY NameRANK";

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
        const query = "WITH NameCounts AS (SELECT first_name ,COUNT(*) AS NameCount FROM user GROUP BY first_name)" +
            "SELECT first_name, NameCount, DENSE_RANK() OVER (ORDER BY NameCount DESC) AS NameRank FROM NameCounts ORDER BY NameRANK";

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

exports.showUserReview = (req, res) => {

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT user.email, review_hostel.review_comment, review_hostel.review_rating, review_restaurant.review_comment, review_restaurant.review_rating FROM user " +
            "INNER JOIN review_hostel ON user.user_id = review_hostel.user_id " +
            "INNER JOIN review_restaurant ON user.user_id = review_restaurant.user_id;";

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

exports.showUserReviewType = (req, res) => {
    const joinType = req.params.joinType;
    const reviewType = req.params.reviewType;

    if (reviewType === 'restaurant') {
        tableName = 'review_restaurant';
    } else if (reviewType === 'hostel') {
        tableName = 'review_hostel';
    } else {
        return res.status(400).json({ error: 'Invalid reviewType' });
    }

    if (joinType === 'left') {
        joinTypeSql = 'LEFT JOIN';
    } else if (joinType === 'right') {
        joinTypeSql = 'RIGHT JOIN';
    } else {
        return res.status(400).json({ error: 'Invalid joinType' });
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT u.email, r.review_comment, r.review_rating FROM user u " + joinTypeSql + " " + tableName + " r ON u.user_id = r.user_id";

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
