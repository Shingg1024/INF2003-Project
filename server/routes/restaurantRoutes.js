const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/restaurant/allrestaurants', restaurantController.getAllRestaurants);

module.exports = router;
