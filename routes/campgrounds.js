const express = require('express');
const router = express.Router();
const campground = require('../controller/campground')
const catchAsync = require('../utils/catchAsync') 
const {storage} = require('../cloudinary');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')



const multer  = require('multer')
const upload = multer({ storage })


router.route('/')
  .get(catchAsync(campground.index))
  .post(isLoggedIn,upload.array('image'), validateCampground ,catchAsync(campground.showCampground));

router.get('/new',isLoggedIn,campground.renderNewForm);

router.route('/:id')
  .get(catchAsync(campground.createCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campground.UpdateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get('/:id/edit',  isLoggedIn,isAuthor,catchAsync(campground.renderEditForm));

module.exports = router;