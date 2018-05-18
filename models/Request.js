var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
	human:String,
  	room: String,
  	admin_name: String,
  	phone_number: Number,
  	message: String,
  	session_id: String,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);