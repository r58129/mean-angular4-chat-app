var mongoose = require('mongoose');

var TinkerSchema = new mongoose.Schema({
	status: String,
  restart: String,
  address: String,	
  port: String,
  sessionID: String,
  whatsappRequestCount: String,
  enableBroadcast: String,
  enableCampaign: String,
  enableGroupTranslate: String,
  updated_at: Date,
  log: [{
  	type:Date
  }],
  created_at: { type: Date, default: Date.now }  	
});

module.exports = mongoose.model('Tinker', TinkerSchema);