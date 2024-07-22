const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');

module.exports.index = async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index' , { campgrounds })
}

module.exports.renderNewForm = (req , res)=>{
  res.render('campgrounds/new')
}

module.exports.showCampground = async (req,res)=>{
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


module.exports.createCampground = async (req ,res,next)=>{

  
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
  
  //adding maps

  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
  const campground = new Campground(req.body.campground);
  //adding GeoJSON
  campground.geometry = geoData.features[0].geometry;
  campground.images=
  req.files.map(f=>({url:f.path,filename:f.filename})); //this returns array
  campground.author = req.user._id;
  await campground.save();

  console.log(campground);

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
  console.log(req.body);
  const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.images.push(...imgs); 
  await campground.save();


if(req.body.deleteImages){
  for(let filename of req.body.deleteImages){
    await cloudinary.uploader.destroy(filename);
  }
  await campground.updateOne({
     $pull:{images:{
      filename:{$in:req.body.deleteImages}
    }}
    });
}


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