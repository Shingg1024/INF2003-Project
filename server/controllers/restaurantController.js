const restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = (req, res) => {
    restaurant.find().then((result) => {
        console.log("------------- MongoDB query used: restaurant.find() -------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.getRes = (req, res) => {
    restaurant.find({
        restaurant_id: req.param.id
    }).then((result) => {
        console.log("------------- MongoDB query used: restaurant.find({restaurant_id: req.param.id}) -------------");
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}



