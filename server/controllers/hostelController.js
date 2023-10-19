const hostel = require('../models/hostelModel');

exports.getAllHostels = (req, res) => {
    hostel.find({ city: "Kyoto" })
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        });
}