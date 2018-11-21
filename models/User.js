var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  // _id: Schema.Types.ObjectId,
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
      formatted_name: String,
      family_name: String,
      given_name: String,
      organization_name: Array,
      organization_unit: Array,
      title:Array,
      email: String,
      telephone: Array,
      address: Array,
      url: String,
      image: String
    },
  	reserve1: String,
	  reserve2: String,
  	updated_at: { type: Date, default: Date.now },
    // campaigns: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }]
});

module.exports = mongoose.model('User', UserSchema);