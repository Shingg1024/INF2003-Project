const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const bookingController = require('../controllers/bookingController');

router.get('/hostel/allhostels', hostelController.getAllHostels);
router.get('/hostel/allhostelsSQL', hostelController.getAllHostelsSQL);
router.post('/hostel/newBooking', bookingController.addHostelBooking);


router.get('/hostel/hos/:id', hostelController.getHos);
module.exports = router;

