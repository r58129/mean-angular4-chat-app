var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new mongoose.Schema({
  	key: {
	    type: String,
	    unique: true,
  	},		 
  	name: String,
  	phone_number: Array,	//include the phone numbers in particaular groups	
		created_at: { type: Date, default: Date.now }  	
  	
});

module.exports = mongoose.model('Group', GroupSchema);