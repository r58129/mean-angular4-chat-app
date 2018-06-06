var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({	
  name: String,
  image64:String,
  imageUrl:String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', UserSchema);