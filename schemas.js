const joi = require('joi')

module.exports.campgroundSchema=joi.object({

  //this must follow the pattern of 
  // campgroung type is object and is required
  //inside this campground obj we have 
  //all diiferent properties to check
  campground: joi.object({

    title:joi.string().required(),
    price:joi.number().required().min(0),
    // image:joi.string().required(),
    location:joi.string().required(),
    description:joi.string().required(),

  }
  ).required()
  ,
  deleteImages: joi.array()
});


// console.log(result);




// review:{
//   rating: Number,
//   body : String

// }

module.exports.reviewSchema=joi.object({

  //this must follow the pattern of 
  // campgroung type is object and is required
  //inside this campground obj we have 
  //all diiferent properties to check
  review: joi.object({

    body:joi.string().required(),
    rating:joi.number().required()
    
  }
  ).required()
});