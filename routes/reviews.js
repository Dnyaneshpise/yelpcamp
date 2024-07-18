const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn,validateReview, isReviewAuthor}=require('../middleware')
const catchAsync = require('../utils/catchAsync') 
const Campground = require('../models/campground');
const Review = require('../models/review');


router.post('/' , isLoggedIn,validateReview ,catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  // console.log('review is submitted')
  req.flash('success','Created new review')
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("you made it!!")
}))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req,res)=>{
  // res.send('deleted')
  await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash('success','Deleted review')
  res.redirect(`/campgrounds/${req.params.id}`);
  // res.send("hello")
}))



module.exports =router;