var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	phone_number:{
      type: String,
      unique: true,
      required: true
    },	
  	first_name: String,
  	middle_name: String,
  	last_name: String,			
  	nickname: String,
  	service: String,	//translate, namecard, others
  	default_spoken_lang: String,
  	default_text_lang: String,
    namecard: {
      vcf: String,
      image: String
    },
  	reserve1: String,
	  reserve2: String,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);