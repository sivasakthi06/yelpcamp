const Campground = require('../models/campground'); 
const Review = require('../models/review'); 

//creating review
module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = await Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review') 
    res.redirect(`/campground/${campground._id}`);
}

//deleting review 
module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Deleted a review') 
    res.redirect(`/campground/${id}`)
}