const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

router.get('/allhostels', hostelController.getAllHostels);

module.exports = router;
