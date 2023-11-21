const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/booking/getBooking/:id', bookingController.getBooking);
router.get('/booking/getAllHostelByUserId/:id', bookingController.getAllHostelByUserId);
router.get('/booking/getRestaurantByUserId/:id', bookingController.getRestaurantByUserId);
router.get('/booking/getHostelCompleted/:id', bookingController.getHostelCompleted);
router.get('/booking/getHostelUpcoming/:id', bookingController.getHostelUpcoming);
router.get('/booking/getRestaurantCompleted/:id', bookingController.getRestaurantCompleted);
router.get('/booking/getRestaurantUpcoming/:id', bookingController.getRestaurantUpcoming);
router.get('/booking/getHostelAndRestaurantCompleted/:id', bookingController.getHostelAndRestaurantCompleted);
router.get('/booking/getHostelAndRestaurantUpcoming/:id', bookingController.getHostelAndRestaurantUpcoming);

router.get('/booking/getHostelBookingCount', bookingController.getHostelBookingCount)

module.exports = router;
