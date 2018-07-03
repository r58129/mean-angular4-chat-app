var mongoose = require('mongoose');

var StaffSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  // passwordConf: {
  //   type: String,
  //   required: true,
  // },
  hash: String,
  salt: String
});
var Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;