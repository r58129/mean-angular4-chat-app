var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
//var server = require('http').createServer(app);

var fs = require('fs');
var key = fs.readFileSync('routes/encryption/private.key');
var cert = fs.readFileSync( 'routes/encryption/mydomain.crt' );

var options = {
key: key,
cert: cert
//ca: ca
};

var server = require('https').createServer(options,app);

var io = require('socket.io')(server,{secure: true});
var Chat = require('../models/Chat.js');
var User = require('../models/User.js');
// var Request = require('../models/Request.js');


var userSocketID = new Array();
var userSocketIDAndUsername = new Array();
var adminSocketID = new Array();
var username = new Array();
var atou = {};
var utoa = {};



var userSocketIDOperatorChannel  = {};
var operatorSocketIDOperatorChannel = {};
var usernameOperatorChannel = {};

var port=3087;
server.listen(port);
console.log('Socket.io is listening on port:' + port);


 const bodyParser = require('body-parser');

 app.use(bodyParser.json());


// socket io
io.on('connection', function (socket) {
  // console.log('User connected');
  // // original disconnect
  // socket.on('disconnect', function() {
  //   console.log('User disconnected');
  // });

// start of "from johnson"
  socket.on('connectuser', function(SocketID){
    console.log(username[userSocketID.indexOf(SocketID)]+' connected to ' + socket.userid); //where is this socket.userid comes from???
    atou[socket.id] = SocketID;
    utoa[SocketID] = socket.id;
    io.to(atou[socket.id]).emit('adminConnected',SocketID);
    console.log(atou[socket.id]+' , '+utoa[userSocketID]);
  });

  socket.on('connectuserOperatorSession', function(phoneNumber){
    io.to(userSocketIDOperatorChannel).emit('operatorConnect',phoneNumber);
    usernameOperatorChannel = phoneNumber;
    console.log('Connected to: '+ phoneNumber);
    io.to(socket.id).emit('users', {users: 'Connecting to: ' + phoneNumber + '.....'});

  });


  socket.on('addContactOperatorSession', function(phoneNumber){
    console.log('Add Contact: '+ phoneNumber);
    io.to(operatorSocketIDOperatorChannel).emit('users', {users: 'Connected to: ' + phoneNumber});
  });

  socket.on('deleteContactOperatorSession', function(phoneNumber){
    console.log('Delete Contact: '+ phoneNumber);
    io.to(operatorSocketIDOperatorChannel).emit('users', {users: ''});
  });

  socket.on('disconnectuserOperatorSession', function(phoneNumber){
    io.to(userSocketIDOperatorChannel).emit('operatorConnect','disconnect');  // '' means disconnect on android app
    console.log('disconnected: '+ phoneNumber);
    io.to(socket.id).emit('users', {users: 'Disconnecting: ' + phoneNumber + '.....'});
  });

  socket.on('chatMessageOperatorSession', function(msg){
    if (operatorSocketIDOperatorChannel == socket.id){
      console.log('Operator sending msg "' + JSON.stringify(msg.message) + '" to ' + usernameOperatorChannel);
      io.to(socket.id).emit('chat',socket.userid + ' (' + usernameOperatorChannel + '): '+ ': '+ JSON.stringify(msg.message));
      io.to(userSocketIDOperatorChannel).emit('operatorToUser',msg);
    }
    if (userSocketIDOperatorChannel == socket.id) {
      console.log(usernameOperatorChannel + ' sending msg "' + msg + '" to operator');
      io.to(socket.id).emit('chat',msg);
      io.to(operatorSocketIDOperatorChannel).emit('chat',msg);
    }
    
  });

  socket.on('user', function(userid){
    console.log("socket.on(users)" +userid);
    if(userid=='admin'){
      adminSocketID.push(socket.id);
      // io.to(socket.id).emit('users',{users:userSocketIDAndUsername});  //orginal
      io.to(socket.id).emit('users', userid, socket.id); //Ben
      console.log("emit socket.on(users)" +socket.id);
      // console.log("emit socket.on(users)" +{users:userSocketIDAndUsername});
    } else if (userid == 'operator') {
      console.log("emit socket.on(operator)" +socket.id);
      operatorSocketIDOperatorChannel = socket.id;
    } else if (userid == 'operatorSessionUser'){
      console.log("emit socket.on(operatorSessionUser)" +socket.id);
      userSocketIDOperatorChannel = socket.id;
    } else {
      console.log(' Customer Lu log userid is '+ userid);   //userid is tel number
      
      userSocketIDAndUsername.push(userid + ' (' + socket.id + ')');
      userSocketID.push(socket.id);
      username.push(userid);
      for(var i in adminSocketID){
        //io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
          // orginal
          // io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername},socket.id);
          io.to(adminSocketID[i]).emit('users',userid,socket.id);
          console.log("emit customer socket.on(users)" +socket.id);
      }
    }
    socket.userid = userid;
    console.log(userid + ' (' +socket.id + ')' + ' is connected.' );

  });

  socket.on('chat message', function(msg){
    console.log('chatting...');
    console.log('socket.id:' + socket.id);
    if(atou[socket.id]){  //admin message
      //console.log('Admin sending msg "' + msg + '" to ' + username[userSocketID.indexOf(atou[socket.id])]);
      // io.to(socket.id).emit('chat',socket.userid +': '+ msg);
      // io.to(socket.id).emit('chat',socket.userid +': '+ msg); // this is for original admin page demo
        
        console.log('Admin sending msg "' + JSON.stringify(msg.message) + '" to ' + username[userSocketID.indexOf(atou[socket.id])]);
      // io.to(socket.id).emit('chat',socket.userid +': '+ msg);
    io.to(socket.id).emit('chat',socket.userid +': '+ JSON.stringify(msg.message)); // this is for original admin page demo
        
      io.to(atou[socket.id]).emit('adminchat',msg); //to android
    } else {  //customer message
      console.log(username[userSocketID.indexOf(socket.id)] + ' sending msg "' + msg + '" to admin');
      // io.to(socket.id).emit('chat',msg); // this is for original admin page demo
      io.to(utoa[socket.id]).emit('chat',msg);  //to android
    }
  });

  socket.on('disconnect', function(){
    if (socket.userid != null){
      if (socket.userid != 'admin'){
        userSocketIDAndUsername.pop(socket.userid + ' (' + socket.id + ')');
        userSocketID.pop(socket.id);
        username.pop(socket.userid);
      for(var i in adminSocketID){
        io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
      }
      }
    //io.to(utoa[socket.id]).emit('disconnect',socket.userid + " disconnected");
    console.log(socket.userid + ' disconnected');

    }
  });
  // end of "from johnson"


  // save-message
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });
});

/* GET ALL CHATS */
router.get('/:room', function(req, res, next) {
  // Chat.find({ room: req.params.room }, function (err, chats) {
    Chat.find({ $and:
    [
      { room: req.params.room },
      { socket_id: { $exists: true } }, 
      { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
    
    ]
    }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* GET SINGLE CHAT BY ID */
router.get('/:id', function(req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});




/* SAVE CHAT postman POST path:192.168.0.102:4080/chat/*/
router.post('/', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE CHAT */
router.put('/:id', function(req, res, next) {
  Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE CHAT */
router.delete('/:id', function(req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET home page. */   /* Lewis */
router.get('/', function(req, res) {
  //  res.send("Hello world 2 !!!");
  //res.send('index');
    res.sendFile(path.join(distDir,'index.html'));
});


/* GET ALL REQUESTS 192.168.0.102:4080/chat/request/all*/ 
router.get('/request/all', function(req, res, next) {
  Chat.find(req.body, function (err, requests) {
    if (err) return next(err);
    res.json(requests);
  });
});

/* GET ALL REQUESTS with phone# and socket id 192.168.0.102:4080/chat/requests/human*/ 
router.get('/request/human', function(req, res, next) { 
  Chat.find({ $and: 
    [ 
      { phone_number: {  $exists: true } }, 
      { socket_id: { $exists: true } }, 
      { nickname: { $exists: false } }
      // { status: "New" } 
    ]
  }, function (err, requests) {
    if (err) return next(err);
    res.json(requests);
  });
});

// db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )

/* GET ALL REQUESTS in same room 192.168.0.102:4080/chat/request/room1*/ 
router.get('/request/:room', function(req, res, next) {
  Chat.find({ room: req.params.room }, function (err, requests) {
    if (err) return next(err);
    res.json(requests);
  });
});

/* GET SINGLE REQUEST BY ID */
router.get('/request/:id', function(req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE REQUEST */
router.post('/request', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE REQUEST */
router.put('/request/:id', function(req, res, next) {
  Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE REQUEST */
router.delete('/request/:id', function(req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* GET ALL USERS in same room 192.168.0.102:4080/chat/user/all*/ 
router.get('/user/all', function(req, res, next) {
  User.find( req.body, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* GET SINGLE user BY ID */
router.get('/user/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* GET ALL REQUESTS in same room 192.168.0.102:4080/chat/request/room1*/ 
// router.get('/request/:room', function(req, res, next) {
//   Chat.find({ room: req.params.room }, function (err, requests) {
//     if (err) return next(err);
//     res.json(requests);
//   });
// });

/* GET SINGLE user BY phone_number */
router.get('/userphone/:phone_number', function(req, res, next) {
  User.find({phone_number:req.params.phone_number}, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* SAVE user */
router.post('/user', function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE REQUEST */
router.put('/user/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE REQUEST by user phone number*/
router.put('/userupdate/:phone_number', function(req, res, next) {
  User.findOneAndUpdate({phone_number:req.params.phone_number}, req.body, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});


/* DELETE REQUEST */
router.delete('/user/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
