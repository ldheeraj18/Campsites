const Review = require('../models/reviews');
const CampSites = require('../models/campSites');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    review.save();
    camp.save();
    req.flash('success', 'Review Added');
    res.redirect(`/Campsites/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await CampSites.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campsites/${id}`);
};