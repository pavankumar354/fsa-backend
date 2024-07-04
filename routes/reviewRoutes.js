const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/submit-rating-review', authenticateToken, reviewController.submitReview);
router.put('/update-rating-review/:id', authenticateToken, reviewController.updateReview);
router.delete('/delete-rating-review/:id', authenticateToken, reviewController.deleteReview);
router.get('/get-ratings-reviews', reviewController.getRatingsReviews);
router.get('/get-average-rating', reviewController.getAverageRating);
router.post('/report-review/:id', authenticateToken, reviewController.reportReview);

module.exports = router;
