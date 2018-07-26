var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    Staff.findOne({ email: username }, function (err, staff) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!staff) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!staff.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      // console.log("Staff email: " + username);
      // console.log("Staff password: " + password);
      return done(null, staff);
    });
  }
));