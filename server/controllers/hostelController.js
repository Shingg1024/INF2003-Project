const hostel = require('../models/hostelModel');

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

// Get booking count
exports.getHostelBookingCount = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const query = "SELECT COUNT(*) AS num FROM booking_hostel";
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

//Add new booking
exports.addHostelBooking = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred' });
        }

        id = req.params.id;
        hostelId = req.params.hostelId;
        bookingId = req.params.bookingId;
        checkInDate = req.params.checkInDate;
        checkOutDate = req.params.checkOutDate;

        //const { bookingId, id, hostelId, checkInDate, checkOutDate } = req.body;

        const query = "INSERT INTO booking_hostel (booking_hostel_id, user_id, hostel_id, date_start, date_end) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [bookingId, id, hostelId, checkInDate, checkOutDate], (err, result) => {
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