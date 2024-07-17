const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const { route } = require('./campgrounds');

router.get('/register',(req,res)=>{
  res.render('users/register')
})

router.post('/register',catchAsync(async (req,res)=>{
  const {email,username,password} = req.body;
  const user = new User({email,username});
  const registeredUser = await User.register(user,password);
  console.log(registeredUser)
  req.flash('success',"Welcome to Campgounds")
  res.redirect('/campgrounds')
}));

module.exports = router;