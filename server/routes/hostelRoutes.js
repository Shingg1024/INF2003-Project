const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const bookingController = require('../controllers/bookingController');

router.get('/hostel/allhostels', hostelController.getAllHostels);
router.post('hostel/newBooking', bookingController.addHostelBooking);


module.exports = router;
