const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const exp = require('constants');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Could not connect to MongoDB", err);
    });


const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended:true }))

app.get('/',(req,res)=>{
  res.render('home')
})

app.get('/campgrounds', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
})

app.get('/campgrounds/new',(req , res)=>{
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req,res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show' , { campground })
})

app.post('/campgrounds',async (req ,res)=>{
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

app.listen(8080,()=>{
  console.log("app started at the port 8080")
})