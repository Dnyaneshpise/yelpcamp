const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passpostLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  }
});


UserSchema.plugin(passpostLocalMongoose);

module.exports = mongoose.model('User',UserSchema);