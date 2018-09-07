var passport = require('passport');
var mongoose = require('mongoose');
var Staff = mongoose.model('Staff');
var async = require('async');
var crypto = require('crypto');

const {google} = require('googleapis');
const scopes = [
  // 'https://mail.google.com/',
  // 'https://www.googleapis.com/auth/gmail.modify',
  // 'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];
const TOKEN_PATH = 'token.json';
var gmail;
var googleAuth;

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

var settings;

function sendemailResetPassword(index, e){
  var message = settings.mappings[index].customer + "'s server is down, server ip: " + settings.mappings[index].internalIp + ", port: " + settings.mappings[index].internalPort;
  var raw = makeBody('eng@airpoint.com.hk', 'support@airpoint.com.hk', getDateTime() + ' Alert!! This airpoint server is down!! ' + message, message + "\n" + e);
  gmail.users.messages.send({
    auth: googleAuth,
    userId: 'me',
    resource: {
      raw: raw
    }
  });

}

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

    // If Passport throws/catches an error
    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }

    // If a user is found
    if(staff){
      // console.log("before generateJwt: " + staff);
      token = staff.generateJwt();
      // console.log("token: " + token);
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

module.exports.forgotPassword = function(req, res) {

  console.log("forgotPassword..." +req.body.email);
  
  if(!req.body.email) {
    sendJSONresponse(res, 400, {
      "message": "A valid email is required"
    });
    return;
  }
  
  async.waterfall([
    function(done) {
      Staff.findOne({
        email: req.body.email
      }).exec(function(err, staff) {
        if (staff) {
          console.log("user is found");
          done(err, staff);
        } else {
          done('User not found.');
        }
      });
    },
    function(staff, done) {
      // create the random token
      console.log("create the random token");
      crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        done(err, staff, token);
      });
    },
    function(staff, token, done) {
      console.log("update token to db" +token);
      Staff.findByIdAndUpdate({ _id: staff._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_staff) {
        done(err, token, new_staff);
      });
    },
    function(token, staff, done) {
      console.log("ready to send email");
      var data = {
        to: staff.email,
        from: email,
        template: 'forgot-password-email',
        subject: 'Password help has arrived!',
        context: {
          url: global.expressIp+':'+global.expressPort+'/api/resetpwd?token=' + token,
          name: user.fullName.split(' ')[0]
        }
      };

      //user google mail api
      // smtpTransport.sendMail(data, function(err) {
      //   if (!err) {
      //     return res.json({ message: 'Kindly check your email for further instructions' });
      //   } else {
      //     return done(err);
      //   }
      // });
    }
  ], function(err) {
    return res.status(422).json({ message: err });
  });



};

module.exports.resetPassword = function(req, res) {

  console.log("resetPassword...");
  if(!req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "A valid email is required"
    });
    return;
  }



};