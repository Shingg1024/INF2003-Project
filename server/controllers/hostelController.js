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
exports.getHos = (req, res) => {
    hostel.find({
        hostel_id: req.param.id
    }).then((result) => {
        console.log("------------- MongoDB query used: hostel.find({ hostel_id: req.param.id })-------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}