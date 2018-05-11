var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Chat = require('../models/Chat.js');

var userSocketID = new Array();
var userSocketIDAndUsername = new Array();
var adminSocketID = new Array();
var username = new Array();
var atou = {};
var utoa = {};

var userSocketIDOperatorChannel  = {};
var operatorSocketIDOperatorChannel = {};
var usernameOperatorChannel = {};

var port=3637;
server.listen(port);
console.log('Socket.io is listening on port:' + port);

// socket io
io.on('connection', function (socket) {
  // console.log('User connected');
  // // original disconnect
  // socket.on('disconnect', function() {
  //   console.log('User disconnected');
  // });

// start of "from johnson"
  socket.on('connectuser', function(SocketID){
    console.log(username[userSocketID.indexOf(SocketID)]+' connected to ' + socket.userid);
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
      console.log('Operator sending msg "' + msg + '" to ' + usernameOperatorChannel);
      io.to(socket.id).emit('chat',socket.userid + ' (' + usernameOperatorChannel + '): '+ ': '+ msg);
      io.to(userSocketIDOperatorChannel).emit('operatorToUser',msg);
    }
    if (userSocketIDOperatorChannel == socket.id) {
      console.log(usernameOperatorChannel + ' sending msg "' + msg + '" to operator');
      io.to(socket.id).emit('chat',msg);
      io.to(operatorSocketIDOperatorChannel).emit('chat',msg);
    }
    
  });

  socket.on('user', function(userid){
    if(userid=='admin'){
      adminSocketID.push(socket.id);
      io.to(socket.id).emit('users',{users:userSocketIDAndUsername});
      console.log("emit socket.on(users)" +socket.id);
      console.log("emit socket.on(users)" +{users:userSocketIDAndUsername});
    } else if (userid == 'operator') {
      operatorSocketIDOperatorChannel = socket.id;
    } else if (userid == 'operatorSessionUser'){
      userSocketIDOperatorChannel = socket.id;
    } else {
      userSocketIDAndUsername.push(userid + ' (' + socket.id + ')');
      userSocketID.push(socket.id);
      username.push(userid);
      for(var i in adminSocketID){
        io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
      }
    }
    socket.userid = userid;
    console.log(userid + ' (' +socket.id + ')' + ' is connected.' );

  });

  socket.on('chat message', function(msg){
    console.log('chatting...');
    if(atou[socket.id]){
      console.log('Admin sending msg "' + msg + '" to ' + username[userSocketID.indexOf(atou[socket.id])]);
      io.to(socket.id).emit('chat',socket.userid +': '+ msg);
      io.to(atou[socket.id]).emit('adminchat',msg);
    } else {
      console.log(username[userSocketID.indexOf(socket.id)] + ' sending msg "' + msg + '" to admin');
      io.to(socket.id).emit('chat',msg);
      io.to(utoa[socket.id]).emit('chat',msg);
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
  Chat.find({ room: req.params.room }, function (err, chats) {
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

/* SAVE CHAT */
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

module.exports = router;
