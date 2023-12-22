const ExpressError = require('./utilities/ExpressError');
const { CampsiteValidation, ReviewsValidation } = require('./Schema');
const CampSites = require('./models/campSites');
const Reviews = require('./models/reviews');


module.exports.verifyUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must Sign in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectTo = req.session.returnTo;
    }
    next();
}

module.exports.ValidateCampsite = (req, res, next) => {
    const { error } = CampsiteValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await CampSites.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to make changes to this Camp");
        return res.redirect(`/campsites/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Reviews.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to delete this review");
        return res.redirect(`/campsites/${id}`)
    }
    next();
}

module.exports.ValidateReview = (req, res, next) => {
    const { error } = ReviewsValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}