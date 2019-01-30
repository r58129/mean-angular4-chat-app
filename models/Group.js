var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new mongoose.Schema({
  	key: {
	    type: String,
	    unique: true,
  	},		 
  	name: String,
  	translate_enabled: String,
  	STT_enabled: String,
  	TTS_enabled: String,
  	// phone_number: Array,	//include the phone numbers in particaular groups	
		phone_number: [{
			number: String,
			source_spoken: String,
		}],
  	target_text_lang: {
  		lang1: String,
  		lang2: String,
  		lang3: String,
  	},
		created_at: { type: Date, default: Date.now }  	
  	
});

module.exports = mongoose.model('Group', GroupSchema);