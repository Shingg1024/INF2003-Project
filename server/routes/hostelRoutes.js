const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/hostel/allhostels', hostelController.getAllHostels);
router.get('/hostel/hos/:id', hostelController.getHos);
module.exports = router;

