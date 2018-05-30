var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	customer_service:String,	//human or robot
	phone_number: String,
	socket_id: String,
  	room: String,				//room = phone_number
  	nickname: String,			//name of admin
  	message: String,
  	Request_status: String,
  	updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ChatSchema);
