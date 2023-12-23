const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const reviews = require('../controlers/reviews');
const { ValidateReview, verifyUser, isReviewAuthor } = require('../middleware')


router.post('/', verifyUser, ValidateReview, AsyncWrapper(reviews.createReview));

router.delete('/:reviewId', verifyUser, isReviewAuthor, AsyncWrapper(reviews.deleteReview));

module.exports = router;