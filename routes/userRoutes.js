const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define a route for /user and specify the controller function
router.get('/alluser', userController.getAllUsers);

module.exports = router;
