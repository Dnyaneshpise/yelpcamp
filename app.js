const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate= require('ejs-mate');
const catchAsync = require('./utils/catchAsync') 
const ExpressError =require('./utils/ExpressError')
const exp = require('constants');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
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
  const campground = await Campground.findById(id);
  res.render('campgrounds/show' , { campground })
}));

app.post('/campgrounds',catchAsync(async (req ,res,next)=>{

  if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req , res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
}));

app.put('/campgrounds/:id', catchAsync(async(req,res)=>{
  const { id } = req.params;
  const updatedCampground = req.body.campground;
  const campground= await Campground.findByIdAndUpdate(id,{...updatedCampground},{new: true});
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("it work")
}));

app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}));

app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const { statusCode =500 } =err;
  if( !err.message ) err.message="something go wrong!"
  res.status(statusCode).render("error",{ err });
})

app.listen(8080,()=>{
  console.log("app started at the port 8080")
})