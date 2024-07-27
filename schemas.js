const BaseJoi = require('joi');


//had to inport this package 
//as joi not have their own

const sanitizeHtml = require('sanitize-html');



//here I am creating my own extesion
//for joi
//better to use 
//express validater next time





const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)

module.exports.campgroundSchema=joi.object({

  //this must follow the pattern of 
  // campgroung type is object and is required
  //inside this campground obj we have 
  //all diiferent properties to check
  campground: joi.object({

    title:joi.string().required().escapeHTML(),
    price:joi.number().required().min(0),
    // image:joi.string().required(),
    location:joi.string().required().escapeHTML(),
    description:joi.string().required().escapeHTML(),

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

    body:joi.string().required().escapeHTML(),
    rating:joi.number().required()
    
  }
  ).required()
});