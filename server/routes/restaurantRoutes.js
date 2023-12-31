const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/restaurant/allrestaurants', restaurantController.getAllRestaurants);
router.get('/restaurant/allrestaurantSQL', restaurantController.allrestaurantSQL);
router.get('/restaurant/res/:id', restaurantController.getRes);
router.get('/restaurant/nearbyRestaurants', restaurantController.nearbyRes);


router.get('/restaurant/getMinRating/:minRating', restaurantController.getMinRating);


module.exports = router;
