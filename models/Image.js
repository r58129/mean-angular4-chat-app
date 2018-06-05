var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	sessionID:String,	
  imagefilename: String,
  imagefile:String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', UserSchema);