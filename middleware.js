const {campgroundSchema,reviewSchema} = require('./schemas')
//joi schema
const ExpressError =require('./utils/ExpressError')
const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateCampground = function(req,res,next){
  const { error }= campgroundSchema.validate(req.body);
if(error){
  const msg = error.details.map(ele => ele.message).join(",")
  // console.log(msg)
  throw new ExpressError(msg,400)
}else{

  next();
}
}


module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user)) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}


module.exports.validateReview = function(req,res,next){
  const { error }= reviewSchema.validate(req.body);
if(error){
  const msg = error.details.map(ele => ele.message).join(",")
  console.log(msg)
  throw new ExpressError(msg,400)
}else{

  next();
}
}
