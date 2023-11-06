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