var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');

module.exports.profileRead = function(req, res) {

//Naturally, this should be fleshed out with some 
//more error trapping — for example, if the user isn’t found 

  console.log("Reading profile...");
  if (!req.payload._id) {
    console.log("No payload ID");
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    console.log("with payload ID");
    Staff
      .findById(req.payload._id)
      .exec(function(err, staff) {
        res.status(200).json(staff);
      });
  }

};
