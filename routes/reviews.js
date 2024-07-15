const express = require('express');
const router = express.Router({ mergeParams: true });

const {reviewSchema} = require('../schemas');//joi schema
const catchAsync = require('../utils/catchAsync') 
const ExpressError =require('../utils/ExpressError');

const Campground = require('../models/campground');
const Review = require('../models/review');

const validateReview = function(req,res,next){
  const { error }= reviewSchema.validate(req.body);
if(error){
  const msg = error.details.map(ele => ele.message).join(",")
  console.log(msg)
  throw new ExpressError(msg,400)
}else{

  next();
}
}


router.post('/' , validateReview ,catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  // console.log('review is submitted')
  req.flash('success','Created new review')
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("you made it!!")
}))


router.delete('/:reviewId', catchAsync(async (req,res)=>{
  // res.send('deleted')
  await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash('success','Deleted review')
  res.redirect(`/campgrounds/${req.params.id}`);
  // res.send("hello")
}))



module.exports =router;