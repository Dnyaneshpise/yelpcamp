const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync') 
const ExpressError =require('../utils/ExpressError')
const Campground = require('../models/campground');

const {campgroundSchema} = require('../schemas')


const validateCampground = function(req,res,next){
  const { error }= campgroundSchema.validate(req.body);
if(error){
  const msg = error.details.map(ele => ele.message).join(",")
  console.log(msg)
  throw new ExpressError(msg,400)
}else{

  next();
}
}


router.get('/', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
}));

router.get('/new',(req , res)=>{
  res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req,res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  res.render('campgrounds/show' , { campground })
}));

router.post('/', validateCampground ,catchAsync(async (req ,res,next)=>{

  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit',catchAsync(async (req , res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
}));

router.put('/:id' , validateCampground, catchAsync(async(req,res)=>{
  const { id } = req.params;
  const updatedCampground = req.body.campground;
  const campground= await Campground.findByIdAndUpdate(id,{...updatedCampground},{new: true});
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("it work")
}));

router.delete('/:id',catchAsync(async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}));


module.exports = router;