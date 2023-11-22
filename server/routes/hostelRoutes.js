const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/hostel/allhostels', hostelController.getAllHostels);
router.get('/hostel/allhostelsSQL', hostelController.getAllHostelsSQL);
router.get('/hostel/hos/:id', hostelController.getHos);
router.get('/hostel/avgPrice', hostelController.getAvgPrice);

router.get('/hostel/getMinRating/:minRating', hostelController.getMinRating);

module.exports = router;

