const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/review/getReview/:id', reviewController.getReview);

router.post('/review/submitHostelReview', reviewController.submitHostelReview);

module.exports = router;
