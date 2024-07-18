const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn,validateReview, isReviewAuthor}=require('../middleware')
const reviews = require('../controller/review')
const catchAsync = require('../utils/catchAsync')

router.post('/' , isLoggedIn,validateReview ,catchAsync(reviews.createReview))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReviews))



module.exports =router;