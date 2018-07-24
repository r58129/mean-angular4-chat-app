var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var fs = require('fs');
// Auth
var cookieParser = require('cookie-parser');
var cors = require('cors');

var passport = require('passport');
// const Auth0Strategy = require('passport-auth0');

var gracefulShutdown;

// [Auth] Bring in the data model, db are defined in app.js
// require('./api/models/db');


// [Auth] Bring in the routes for the API (delete the default routes)
// var routesApi = require('./api/routes/index');

// mongoose.Promise = global.Promise;

//update this port for nodejs express addr
global.expressIp = 'https://airpoint.com.hk';
global.expressPort = 4060;
global.socketIoPort = 3637;

global.dbIp = 'mongodb://192.168.0.102/';
global.dbName = 'chatService';

// var dbURI = global.dbIp +global.dbName;

// if (process.env.NODE_ENV === 'production') {
//   dbURI = process.env.MONGOLAB_URI;
//   console.log('process.env.MONGOLAB_URI' + dbURI);
// }

// mongoose.connect('mongodb://localhost/chatService')
//mongoose.connect('mongodb://192.168.0.102/luChatService')

// mongoose.connect(global.dbIp +global.dbName)
//   .then(() =>  console.log('connection successful'))
//   .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

mongoose.connect( global.dbIp +global.dbName);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' +  global.dbIp +global.dbName);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./models/Staff');


// [Auth] Bring in the Passport config after model is defined
require('./api/config/passport'); //require strategary after nodel definition

// Bring in the routes for the API
var chat = require('./routes/chat');
var routesApi = require('./routes/index');    

var app = express();


app.set('view engine', 'html');
//app.use(logger('dev'));
app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({limit: '16mb',extended:false}));
app.use(cookieParser());
app.use(cors());
// app.get('/a', function (req, res) {
//     console.log('hihi hello lewis tse for home page!!!');
//   //return res.sendFile('index.html');
//     return res.sendFile(path.join(distDir,'index.html'));
// });


//app.use('/', chat);


//app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Disposition, Accept");
  res.header("Access-Control-Expose-Headers", "Content-Disposition, filename");
  // res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

  next();

});

// should be called after passport is initialized
// app.use('/chat', chat);


// global.expressAddr = expressIp +':'+expressPort+'/';
// console.log('Express Addr: ' +global.expressAddr);

// const strategy = new Auth0Strategy(
//   {
//     domain: 'aptcmai0.auth0.com',
//     clientID: 'QHj13LadXiKO4qLoj7IQaJWv3Z0s3j5D',
//     clientSecret: 'xxx',
//     callbackURL: global.expressAddr
//     // callbackURL: 'https://192.168.0.102:3089/'
//   },
//   (accessToken, refreshToken, extraParams, profile, done) => {
//     return done(null, profile);
//   }
// );
// passport.use(strategy);

// // This can be used to keep a smaller payload
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// ...
app.use(passport.initialize());
// app.use(passport.session());

 //New test from Lewis
 //GET route for reading data

//app.set('views', __dirname + '/dist');
//app.engine('html', require('ejs').renderFile);


// Passport should be initialized as Express middleware 
//just before the API routes are added, as these routes 
//are the first time that Passport will be used, Auth

app.use('/api', routesApi);
app.use('/chat', chat);

// [Auth] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
