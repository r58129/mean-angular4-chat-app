var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	customer_service:String,	//human or robot
	phone_number: String,
	socket_id: String,
  room: String,				//room = phone_number
  nickname: String,			//name of admin
  message: String,
  request_status: String,
  filename: String,
  	// image: {data: Buffer, contentType: String},
  image: String,
  file_path: String,
  operator_request: String,
  type: String, // indicate diff chat apps, e.g. line, wechat, messenger, twilioWhatApp, twilioSMS
  people_in_room: String,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
