const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
  title:String,
  images:[{

    url:String,
    filename:String

  }],
  price:Number,
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
});

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
