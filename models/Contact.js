var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  	id: {
	    type: String,
	    unique: true,
	    required: true
  	},		//id of line, wehchat, messenger and twilioWhatsApp and twilioSMS 
  	name: String,
  	package: String,	//line, wehchat, messenger and twilioWhatsApp and twilioSMS  	
  	
});

module.exports = mongoose.model('Contact', ContactSchema);