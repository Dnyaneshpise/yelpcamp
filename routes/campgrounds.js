const express = require('express');
const router = express.Router();
const campground = require('../controller/campground')
const catchAsync = require('../utils/catchAsync') 
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')




router.get('/', catchAsync(campground.index));

router.get('/new',isLoggedIn,campground.renderNewForm)

router.get('/:id', catchAsync(campground.createCampground));

router.post('/' ,isLoggedIn, validateCampground ,catchAsync(campground.showCampground))

router.get('/:id/edit',  isLoggedIn,isAuthor,catchAsync(campground.renderEditForm));

router.put('/:id' ,isLoggedIn, isAuthor, validateCampground, catchAsync(campground.UpdateCampground));

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));


module.exports = router;