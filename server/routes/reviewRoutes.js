const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/review/getReview/:id', reviewController.getReview);

module.exports = router;
