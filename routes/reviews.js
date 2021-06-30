const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground'); 
const Review = require('../models/review'); 
const {validateReview,isLoggedIn,isReviewAuthor}= require('../middleware');
//const {reviewSchema} = require('../schemas.js');//JOI schema
const reviews = require('../controllers/reviews');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//review

router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview))

//deleting review 
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;