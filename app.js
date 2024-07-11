const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate= require('ejs-mate');
const joi = require('joi')
const catchAsync = require('./utils/catchAsync') 
const ExpressError =require('./utils/ExpressError')
const exp = require('constants');
const { title } = require('process');
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


const validateCampground = function(req,res,next){
  const campgroundSchema=joi.object({

    //this must follow the pattern of 
    // campgroung type is object and is required
    //inside this campground obj we have 
    //all diiferent properties to check
    campground: joi.object({

      title:joi.string().required(),
      price:joi.number().required().min(0),
      image:joi.string().required(),
      location:joi.string().required(),
      description:joi.string().required(),

    }
    ).required()
  });

  const { error }= campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(ele => ele.message).join(",")
    console.log(msg)
    throw new ExpressError(msg,400)
  }else{

    next();
  }
  // console.log(result);
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
  const campground = await Campground.findById(id);
  res.render('campgrounds/show' , { campground })
}));

app.post('/campgrounds',catchAsync(async (req ,res,next)=>{

  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)

    const campgroundSchema=joi.object({

      //this must follow the pattern of 
      // campgroung type is object and is required
      //inside this campground obj we have 
      //all diiferent properties to check
      campground: joi.object({

        title:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().required(),
        location:joi.string().required(),
        description:joi.string().required(),

      }
      ).required()
    });

    const { error }= campgroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(ele => ele.message).join(",")
      throw new ExpressError(msg,400)
    }
    // console.log(result);

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

app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const { statusCode =500 } =err;
  if( !err.msg ) err.msg="something go wrong!"
  res.status(statusCode).render("error",{ err });
})

app.listen(8080,()=>{
  console.log("app started at the port 8080")
})