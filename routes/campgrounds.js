const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync') 
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')




router.get('/', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
}));

router.get('/new',isLoggedIn,(req , res)=>{
  res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req,res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
    .populate('author');

  console.log(campground.reviews)
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

router.post('/' ,isLoggedIn, validateCampground ,catchAsync(async (req ,res,next)=>{

  
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
  
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success' , 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id/edit',  isLoggedIn,isAuthor,catchAsync(async (req , res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
}));

router.put('/:id' ,isLoggedIn, isAuthor, validateCampground, catchAsync(async(req,res)=>{
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

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  // console.log(campground);
  req.flash('success','Deleted Campground')
  res.redirect('/campgrounds')
}));


module.exports = router;