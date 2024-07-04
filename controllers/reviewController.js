const { RatingReview, Report } = require('../models/Review');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.submitReview = async (req, res) => {
  try {
    const { rating, review, hotelname } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let ratingReview = await RatingReview.findOne({ hotelName: hotelname });
    if (!ratingReview) {
      ratingReview = new RatingReview({ hotelName: hotelname, reviews: [] });
    }

    ratingReview.reviews.push({
      _id: new mongoose.Types.ObjectId(),
      userId: userId,
      rating: rating,
      review: review,
      userName: `${user.firstName} ${user.lastName}`,
    });

    await ratingReview.save();
    res.status(201).json({ message: 'Rating and review submitted successfully!' });
  } catch (error) {
    console.error('Error submitting rating and review:', error);
    res.status(500).json({ error: 'Failed to submit rating and review.' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const existingReview = await RatingReview.findOne({ 'reviews._id': reviewId });
    if (!existingReview) return res.status(404).json({ error: 'Review not found.' });

    const reviewToUpdate = existingReview.reviews.find(r => r._id.toString() === reviewId);
    if (!reviewToUpdate) return res.status(404).json({ error: 'Review not found within the service.' });
    if (reviewToUpdate.userId.toString() !== userId) return res.status(403).json({ error: 'You do not have permission to edit this review.' });

    reviewToUpdate.rating = rating;
    reviewToUpdate.review = review;

    await existingReview.save();
    res.status(200).json({ message: 'Review updated successfully!' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review.' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;
    const existingReview = await RatingReview.findOne({ 'reviews._id': reviewId });
    if (!existingReview) return res.status(404).json({ error: 'Review not found.' });

    const reviewToDelete = existingReview.reviews.find(r => r._id.toString() === reviewId);
    if (reviewToDelete.userId.toString() !== userId) return res.status(403).json({ error: 'You do not have permission to delete this review.' });

    existingReview.reviews = existingReview.reviews.filter(r => r._id.toString() !== reviewId);
    await existingReview.save();

    res.status(200).json({ message: 'Review deleted successfully!' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
};

exports.getRatingsReviews = async (req, res) => {
  try {
    const { hotelname } = req.query;
    const ratingsReviews = await RatingReview.findOne({ hotelName: hotelname });
    if (!ratingsReviews) return res.status(404).json({ error: 'No reviews found for this hotel' });
    res.status(200).json(ratingsReviews.reviews);
  } catch (error) {
    console.error('Error fetching ratings and reviews:', error);
    res.status(500).json({ error: 'Failed to fetch ratings and reviews.' });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { hotelname } = req.query;
    const ratings = await RatingReview.find({ hotelName: hotelname }, 'reviews.rating');
    let totalRating = 0;
    let totalRatings = 0;
    ratings.forEach((rating) => {
      rating.reviews.forEach((review) => {
        totalRating += review.rating;
        totalRatings++;
      });
    });
    const averageRating = totalRating / totalRatings;
    res.status(200).json({ averageRating, totalReviews: totalRatings });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).json({ error: 'Failed to get average rating.' });
  }
};

exports.reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const report = new Report({ reviewId: id, reason });
    await report.save();
    res.status(200).json({ message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ error: 'An error occurred while reporting the review' });
  }
};
