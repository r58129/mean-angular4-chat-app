var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  	id: String,		//id of line, wehchat, messenger and twilioWhatsapp and twilioSMS 
  	name: String,
  	package: String,	//line, wehchat, messenger and twilioWhatsapp and twilioSMS  	
  	
});

module.exports = mongoose.model('Contact', ContactSchema);