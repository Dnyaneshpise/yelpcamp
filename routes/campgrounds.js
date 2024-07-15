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

  //if somebody delete it it will give error not by 
  //mongoose but in templeting since it will be an 
  //empty campground object
  
  if(!campground){
    req.flash("error","This campground was deleted");
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show' , { campground })
  //{,msg:req.flash('success')}
}));

router.post('/', validateCampground ,catchAsync(async (req ,res,next)=>{

  
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
  
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success' , 'Successfully made a new campground!')
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
  if(!campground){
    req.flash("error","This campground was deleted");
    return res.redirect('/campgrounds');
  }
  req.flash('success',"Successfully updated Campground!");
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("it work")
}));

router.delete('/:id',catchAsync(async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  // console.log(campground);
  req.flash('success','Deleted Campground')
  res.redirect('/campgrounds')
}));


module.exports = router;