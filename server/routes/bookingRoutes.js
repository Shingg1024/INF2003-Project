const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/booking/getBooking/:id', bookingController.getBooking);

module.exports = router;
