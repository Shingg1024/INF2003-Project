const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurant', restaurantController.getRestaurantByName);
router.post('/addrestaurant', restaurantController.addRestaurant);

module.exports = router;
