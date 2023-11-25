const hostel = require('../models/hostelModel');
const db = require('../dataset/db');

exports.getAllHostels = (req, res) => {
    hostel.find({
        city: "Kyoto"
    }).then((result) => {
        console.log("------------- MongoDB query used: hostel.find({ city: 'Kyoto' })-------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.getAllHostelsSQL = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT h.hostel_id, h.hostel_name, h.price, ROUND(AVG(r.review_rating),2) AS avg_rating FROM hostel h JOIN booking_hostel b ON h.hostel_id = b.hostel_id LEFT JOIN review_hostel r ON b.booking_hostel_id = r.booking_hostel_id GROUP BY h.hostel_id, h.hostel_name, h.price;";
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
}

exports.getHos = (req, res) => {
    hostel.find({
        hostel_id: req.params.id
    }).then((result) => {
        console.log("------------- MongoDB query used: hostel.find({ hostel_id: req.param.id })-------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.getAvgPrice = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }


        const query = "SELECT ROUND(AVG(price),2) AS avgPrice FROM hostel where city = 'Kyoto' ";
        connection.query(query, (err, result) => {
            try {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'An error occurred' });
                }

                res.json({ avgPrice: result[0].avgPrice });
                console.log("------------- SQL query used: " + query + " -------------");
            } finally {
                db.releaseConnection(connection);
            }
        });

    });
};

exports.getMinRating = (req, res) => {
    var rating = req.params.minRating;
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT h.hostel_id, h.hostel_name, h.price, ROUND(AVG(r.review_rating), 2) AS avg_rating FROM review_hostel r JOIN booking_hostel b ON r.booking_hostel_id = b.booking_hostel_id JOIN hostel h ON b.hostel_id = h.hostel_id GROUP BY h.hostel_id, h.hostel_name, h.price HAVING avg_rating > ?; ";
        
        connection.query(query, rating, (err, result) => {
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
