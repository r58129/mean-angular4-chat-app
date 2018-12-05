var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TranslateSchema = new mongoose.Schema({

  original_message: String,
  translated_message: String,
  source_language: String,
  target_language: String,
  group_key: String,
  group_name: String,
  phone_number: String,
  created_at: { type: Date, default: Date.now }
  	
});

module.exports = mongoose.model('Translate', TranslateSchema);