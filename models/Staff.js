var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var StaffSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  },
  reset_password_token: {
    type: String
  },
  reset_password_expires: {
    type: Date
  },
  companyName: String,
  baseAddress: String,
  expressPort: String,  
  tinkerPort: String,
  sokcetIoPort: String,
  mongodbName: String,
  phoneNumber: String,
  online: String,
  valid: String,
  reserve1: String,
  reserve2: String

});

StaffSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

StaffSchema.methods.validPassword = function(password) {
  // this.salt = crypto.randomBytes(16).toString('hex');
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






