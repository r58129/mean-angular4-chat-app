var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
	customer_service:String,	//human or robot
  	room: String,				//phone #
  	// admin_name: String,
  	phone_number: Number,
  	message: String,			//pass the stored message when join room
  	socket_id: String,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', RequestSchema);