const restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = (req, res) => {
    restaurant.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.getRestaurantByName = (req, res) => {
    const name = req.query.name + '  ';
    //console.log(name);
    restaurant.findOne({ Name: name }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log(err);
    });
}

exports.addRestaurant = (req, res) => {
    const rest = new restaurant({
        name: req.body.name,
        japaneseName: req.body.japaneseName
        //  ...
    });
    rest.save().then((result) => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err);
        })
}
