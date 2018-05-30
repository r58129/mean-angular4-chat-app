var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	phone_number:String,	
  	first_name: String,
  	middle_name: String,
  	last_name: String,			
  	nickname: String,
  	service: String,	//translate, namecard, others
  	default_speaking_lang: String,
  	default_writing_lang: String,
  	reserve1: String,
	reserve2: String,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);