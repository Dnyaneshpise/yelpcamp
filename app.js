const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError =require('./utils/ExpressError')
const exp = require('constants');
const { title } = require('process');
require('dotenv').config();

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')


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

app.use(express.static(path.join(__dirname,'public')));

const sessionConfig ={
  secret: 'thisissecretdonttellanybody',
  resave:false,
  saveUninitialized:true,
  cookies:{
    httpOnly: true,
    expires:Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig));
app.use(flash())

app.use((req,res,next)=>{
  //on every single request we set up this variable
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/',(req,res)=>{
  res.render('home')
})


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