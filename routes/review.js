const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const Review = require('../models/reviews');
const CampSites = require('../models/campSites')
const { ValidateReview, verifyUser, isReviewAuthor } = require('../middleware')


router.post('/', verifyUser, ValidateReview, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Review Added');
    res.redirect(`/Campsites/${id}`);
}))

router.delete('/:reviewId', verifyUser, isReviewAuthor, AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampSites.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campsites/${id}`);
}))

module.exports = router;