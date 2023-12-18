const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const Review = require('../models/reviews');
const CampSites = require('../models/campSites')
const { ReviewsValidation } = require('../Schema');

const ValidateReview = (req, res, next) => {
    const { error } = ReviewsValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', ValidateReview, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Review Added');
    res.redirect(`/Campsites/${id}`);
}))

router.delete('/:reviewId', AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampSites.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campsites/${id}`);
}))

module.exports = router;