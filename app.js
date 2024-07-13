const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const ejsMate= require('ejs-mate');
const {campgroundSchema , reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync') 
const ExpressError =require('./utils/ExpressError')
const exp = require('constants');
const { title } = require('process');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Could not connect to MongoDB", err);
    });


const app = express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended:true }))
app.use(methodOverride('_method'))


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




app.get('/',(req,res)=>{
  res.render('home')
})

app.get('/campgrounds', catchAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
}));

app.get('/campgrounds/new',(req , res)=>{
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  res.render('campgrounds/show' , { campground })
}));

app.post('/campgrounds', validateCampground ,catchAsync(async (req ,res,next)=>{

  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req , res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
}));

app.put('/campgrounds/:id' , validateCampground, catchAsync(async(req,res)=>{
  const { id } = req.params;
  const updatedCampground = req.body.campground;
  const campground= await Campground.findByIdAndUpdate(id,{...updatedCampground},{new: true});
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("it work")
}));

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}));

app.post('/campgrounds/:id/reviews' , validateReview ,catchAsync(async (req,res)=>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  // console.log('review is submitted')
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("you made it!!")
}))


app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const { statusCode =500 } =err;
  if( !err.msg ) err.msg="something go wrong!"
  res.status(statusCode).render("error",{ err });
})

PORT=process.env.PORT||3000

app.listen(PORT,()=>{
  console.log("app started at the port", PORT)
})