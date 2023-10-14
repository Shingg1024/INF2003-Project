const hostel = require('../models/hostel');

exports.getAllHostels = (req, res) => {
    hostel.find({ city: "Kyoto" })
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            console.log(err);
        });
}