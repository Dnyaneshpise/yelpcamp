const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author:'669ab082ec9887ecd22bf0df',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [ 
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images:{
        url:`https://picsum.photos/400?random=${Math.random()}`,
        filename: "randImg"
      } ,   
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat atque quos quasi ratione optio nesciunt natus labore fugit aut amet ad accusantium ipsa obcaecati veritatis ea rem dolorum, distinctio vero.",
        price //price: price
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
