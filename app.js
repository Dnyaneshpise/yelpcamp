const express = require('express');
const path =require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
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


app.get('/',(req,res)=>{
  res.render('home')
})

app.get('/makecampground',async (req,res)=>{
  const camp = new Campground({
    title:'My Backyard',description: 'cheap camping'
  })
  await camp.save();
  res.send(camp)
})

app.listen(8080,()=>{
  console.log("app started at the port 8080")
})