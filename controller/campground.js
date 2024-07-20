
const Campground = require('../models/campground');

module.exports.index = async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
}

module.exports.renderNewForm = (req , res)=>{
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
    .populate('author');

  // console.log(campground.reviews)
  //if somebody delete it it will give error not by 
  //mongoose but in templeting since it will be an 
  //empty campground object
  
  if(!campground){
    req.flash("error","This campground was deleted");
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show' , { campground })
  //{,msg:req.flash('success')}
}


module.exports.showCampground = async (req ,res,next)=>{

  
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
  


  const campground = new Campground(req.body.campground);
  campground.images=
  req.files.map(f=>({url:f.path,filename:f.filename})); //this returns array
  campground.author = req.user._id;
  await campground.save();
  req.flash('success' , 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.renderEditForm = async (req , res)=>{
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground})
}


module.exports.UpdateCampground = async(req,res)=>{
  const { id } = req.params;
  const updatedCampground = req.body.campground;
  const campground= await Campground.findByIdAndUpdate(id,{...updatedCampground},{new: true});
  if(!campground){
    req.flash("error","This campground was deleted");
    return res.redirect('/campgrounds');
  }
  req.flash('success',"Successfully updated Campground!");
  res.redirect(`/campgrounds/${campground._id}`)
  // res.send("it work")
}

module.exports.deleteCampground = async(req,res)=>{
  const { id } = req.params;
  const campground= await Campground.findByIdAndDelete(id);
  // console.log(campground);
  req.flash('success','Deleted Campground')
  res.redirect('/campgrounds')
}