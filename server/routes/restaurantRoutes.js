const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/restaurant/allrestaurants', restaurantController.getAllRestaurants);
router.get('/restaurant/res/:id', restaurantController.getRes);
router.get('/restaurant/nearbyRestaurants', restaurantController.nearbyRes);

module.exports = router;
