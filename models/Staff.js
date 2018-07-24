var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var StaffSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
    // trim: true
  },
  name: {
    type: String,
    // unique: true,
    required: true
    // trim: true
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

StaffSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

StaffSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

StaffSchema.methods.generateJwt = function() {
  // set expiration to 7 days
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports  = mongoose.model('Staff', StaffSchema);
// module.exports = Staff;






