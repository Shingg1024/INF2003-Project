const restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = (req, res) => {
    restaurant.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}


