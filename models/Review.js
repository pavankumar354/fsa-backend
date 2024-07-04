const mongoose = require('mongoose');

const ratingReviewSchema = new mongoose.Schema({
  hotelName: String,
  reviews: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      review: String,
      userName: String,
    }
  ]
});

const reportSchema = new mongoose.Schema({
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'RatingReview', required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const RatingReview = mongoose.model('RatingReview', ratingReviewSchema);
const Report = mongoose.model('Report', reportSchema);

module.exports = { RatingReview, Report };
