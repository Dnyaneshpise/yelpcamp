const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema(
  {

    url:String,
    filename:String

  }
);

ImageSchema.virtual('thumbnail').get(function (){
  return this.url.replace('/upload','/upload/w_200')
}
)

const opts ={toJSON:{virtuals:true}}

const CampgroundSchema = new Schema({
  title:String,
  images:[ImageSchema],
  price:Number,
  geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
  },
  description:String,
  location:String,
  author:{
    type : Schema.Types.ObjectId,
    ref:'User'
  },
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref:'Review'
    }
  ]
} , opts );

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href="/campgrounds/${this._id}" target="_blank">${this.title}</a></strong>`
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
  // console.log("Deleted")
  if (doc) {
    try {
      await Review.deleteMany({
        _id: {
          $in: doc.reviews
        }
      });
      console.log('Related reviews deleted');
    } catch (error) {
      console.error('Error deleting related reviews:', error);
    }
  }
  console.log(doc)
})

module.exports= mongoose.model('Campground' , CampgroundSchema);
