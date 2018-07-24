var passport = require('passport');
var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//in reality, this code would have a number of error traps, 
//validating form inputs and catching errors in the save function. 
//They’re omitted here to highlight the main functionality of the code.

module.exports.register = function(req, res) {

  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  console.log("register...");
  var staff = new Staff();

  staff.name = req.body.name;
  staff.email = req.body.email;

  staff.setPassword(req.body.password);

  staff.save(function(err) {
    var token;
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      token = staff.generateJwt();
      sendJSONresponse(res, 200, {
      "token" : token
      });
    }
  });

};

module.exports.login = function(req, res) {

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  passport.authenticate('local', function(err, staff, info){
    var token;

    console.log("logging in...");
    var staff = new Staff();

    // If Passport throws/catches an error
    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }

    // If a user is found
    if(staff){
      // console.log("before generateJwt");
      token = staff.generateJwt();  
      sendJSONresponse(res, 200, {
        "token" : token
      });
    } else {
      // If user is not found
      // res.status(401).json(info);
      sendJSONresponse(res, 401, info);
    }
  })(req, res);

};