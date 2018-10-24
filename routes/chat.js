var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();

//var server = require('http').createServer(app);

var fs = require('fs');
var key = fs.readFileSync('routes/encryption/privkey.pem');
var cert = fs.readFileSync( 'routes/encryption/cert.pem' );

var options = {
key: key,
cert: cert
//ca: ca
};

var jwt = require('express-jwt');
var auth = jwt({
  secret: global.mySecret,
  userProperty: 'payload'
});

var server = require('https').createServer(options,app);

var io = require('socket.io')(server,{secure: true});
// var io = require('socket.io')(server,{secure: true, pingInterval: 25000, pingTimeout: 60000});
var Chat = require('../models/Chat.js');
var User = require('../models/User.js');
var Contact = require('../models/Contact.js');
var Staff = require('../models/Staff.js');

var watchdog = require("watchdog")
const timeout = 33000;  //33s
const dog = new watchdog.Watchdog(timeout);
const food = { data: 'delicious' };

var userSocketID = new Array();
var userSocketIDAndUsername = new Array();
var adminSocketID = new Array();
var username = new Array();
var atou = {};
var utoa = {};

var operatorSessionUserConnected = false;

var userSocketIDOperatorChannel  = {};
var operatorSocketIDOperatorChannel = {};
var usernameOperatorChannel = {};

var userSocketIDOperatorChannelNonAndroid = {};
var operatorSocketIDOperatorChannelNonAndroid = {};

var port=global.socketIoPort;
server.listen(port);
console.log('Socket.io is listening on port:' + port);


const bodyParser = require('body-parser');


app.use(bodyParser.json());

dog.on('reset', () => {

  console.log('Timeout!');
  console.log('operatorSocketIDOperatorChannel: ' +operatorSocketIDOperatorChannel);
  console.log('operatorSocketIDOperatorChannelNonAndroid: ' +operatorSocketIDOperatorChannelNonAndroid);   
  console.log('userSocketIDOperatorChannelNonAndroid: ' +userSocketIDOperatorChannelNonAndroid);
  console.log('userSocketIDOperatorChannel: ' +userSocketIDOperatorChannel);

  operatorSocketIDOperatorChannel = '';
  operatorSocketIDOperatorChannelNonAndroid = '';
  console.log('operatorSocketIDOperatorChannel.length: ' +operatorSocketIDOperatorChannel.length);
  console.log('operatorSocketIDOperatorChannelNonAndroid.length: ' +operatorSocketIDOperatorChannelNonAndroid.length);   


});

dog.on('feed',  () => {
  console.log('operator channel keepalive')
});

// socket io
io.on('connection', function (socket) {
  // console.log('User connected');
  // // original disconnect
  // socket.on('disconnect', function() {
  //   console.log('User disconnected');
  // });

  // start of "from johnson"

  // ack from client to server
  socket.on('KeepAliveMessage', (name, fn) => {
    if (operatorSessionUserConnected){
    //      console.log('Send Ack');
      fn('ACK');
    }
  });


  socket.on('connectuser', function(SocketID){
    console.log(username[userSocketID.indexOf(SocketID)]+' connected to ' + socket.userid); //where is this socket.userid comes from???
    atou[socket.id] = SocketID;
    utoa[SocketID] = socket.id;
    io.to(atou[socket.id]).emit('adminConnected',SocketID);
    console.log(atou[socket.id]+' , '+utoa[userSocketID]);
  });

  socket.on('connecting', function(msg){
    console.log('connecting: '+ msg);
  });

  socket.on('connectuserOperatorSession', function(phoneNumber){
    io.to(userSocketIDOperatorChannel).emit('operatorConnect',phoneNumber);
    usernameOperatorChannel = phoneNumber;
    console.log('Connected to: '+ phoneNumber);
    // io.to(socket.id).emit('users', {users: 'Connecting to: ' + phoneNumber + '.....'});
    io.to(socket.id).emit('users', phoneNumber, socket.id );  //Ben
  });


  socket.on('addContactOperatorSession', function(phoneNumber){
    console.log('Add Contact: '+ phoneNumber);
    // io.to(operatorSocketIDOperatorChannel).emit('users', {users: 'Connected to: ' + phoneNumber}); //no need for new UI
  });

  socket.on('deleteContactOperatorSession', function(phoneNumber){
    console.log('Delete Contact: '+ phoneNumber);
    // io.to(operatorSocketIDOperatorChannel).emit('users', {users: ''}); //no need in new UI
  });

  socket.on('disconnectuserOperatorSession', function(phoneNumber){
    console.log('disconnect userSocketIDOperatorChannel: '+userSocketIDOperatorChannel);

    io.to(userSocketIDOperatorChannel).emit('operatorConnect','disconnect');  // '' means disconnect on android app
    console.log('disconnected: '+ phoneNumber);
    // io.to(socket.id).emit('users', {users: 'Disconnecting: ' + phoneNumber + '.....'});  //this is for original plain UI only
  });

  socket.on('chatMessageOperatorSession', function(msg){
    if (operatorSocketIDOperatorChannel == socket.id){
      console.log('Operator sending msg "' + JSON.stringify(msg.message) + '" to ' + usernameOperatorChannel);
      // io.to(socket.id).emit('chat',socket.userid + ' (' + usernameOperatorChannel + '): '+ ': '+ JSON.stringify(msg.message));
      // io.to(socket.id).emit('chat',socket.userid , usernameOperatorChannel ,JSON.stringify(msg.message));    
      // var jsonMesg = {};
      // jsonMesg.type = "text";
      // jsonMesg.path = "nil";
      // jsonMesg.message = msg;
      io.to(userSocketIDOperatorChannel).emit('operatorToUser',msg);
      // io.to(userSocketIDOperatorChannel).emit('operatorToUser',jsonMesg);
    }
    if (userSocketIDOperatorChannel == socket.id) {
      console.log(usernameOperatorChannel + ' sending msg "' + JSON.stringify(msg.message) + '" to operator');
      // io.to(socket.id).emit('chat', msg);
      // io.to(socket.id).emit('chat', usernameOperatorChannel, msg);
      io.to(operatorSocketIDOperatorChannel).emit('chat', msg);  //Ben
    }    
  });

  socket.on('connectuserOperatorSessionNonAndroid', function(phoneNumber){
    io.to(userSocketIDOperatorChannelNonAndroid).emit('operatorConnectNonAndroid',phoneNumber);
    usernameOperatorChannel = phoneNumber;
    console.log('Connecting to: '+ phoneNumber);
    // ioHttp.to(socket.id).emit('users', {users: 'Connecting to: ' + phoneNumber + '.....'});
   io.to(socket.id).emit('users', phoneNumber, socket.id );  //Ben
  });

  socket.on('addContactOperatorSessionNonAndroid', function(phoneNumber){
    console.log('Add Contact: '+ phoneNumber);
    // ioHttp.to(operatorSocketIDOperatorChannelNonAndroid).emit('users', {users: 'Connected to: ' + phoneNumber});
  });

  socket.on('deleteContactOperatorSessionNonAndroid', function(phoneNumber){
    console.log('Delete Contact: '+ phoneNumber);
    // ioHttp.to(operatorSocketIDOperatorChannelNonAndroid).emit('users', {users: ''});
  });


  socket.on('disconnectuserOperatorSessionNonAndroid', function(phoneNumber){
    console.log('disconnect userSocketIDOperatorChannelNonAndroid: ' +userSocketIDOperatorChannelNonAndroid);
    console.log(' disconnect socket.id: '+ socket.id);
    io.to(userSocketIDOperatorChannelNonAndroid).emit('operatorConnectNonAndroid','disconnect');  // '' means disconnect on mutlichat server
    console.log('disconnected: '+ phoneNumber);
    // ioHttp.to(socket.id).emit('users', {users: 'Disconnecting: ' + phoneNumber + '.....'});
  });

  socket.on('chatMessageOperatorSessionNonAndroid', function(msg, package){
    console.log(msg+" "+package);
    if (operatorSocketIDOperatorChannelNonAndroid == socket.id){
      console.log('OperatorNonAndroid sending msg "' + JSON.stringify(msg.message) + '" to ' + usernameOperatorChannel);
      // ioHttp.to(socket.id).emit('chat',socket.userid + ' (' + usernameOperatorChannel + '): '+ ': '+ msg);
      // var jsonMesg = {};
      // jsonMesg.type = "text";
      // jsonMesg.path = "nil";
      // jsonMesg.message = msg;
      // jsonMesg.sender = usernameOperatorChannel;
      // jsonMesg.package = package;
      io.to(userSocketIDOperatorChannelNonAndroid).emit('operatorToUserNonAndroid',msg);
      console.log("usernameOperatorChannel: " + usernameOperatorChannel );
      console.log("package: " + package );
      console.log("operatorSocketIDOperatorChannelNonAndroid: " + socket.id );
    }
    if (userSocketIDOperatorChannelNonAndroid == socket.id) {
      console.log(usernameOperatorChannel + ' sending msg "' + JSON.stringify(msg.message) + '" to operator');
      // ioHttp.to(socket.id).emit('chat',msg);
      io.to(operatorSocketIDOperatorChannelNonAndroid).emit('chat',msg);
    }
    
  });

  socket.on('operatorChannel', function(status){

    // console.log('operatorSocketIDOperatorChannel: ' +operatorSocketIDOperatorChannel);
    // console.log('operatorSocketIDOperatorChannel: ' +operatorSocketIDOperatorChannel.length);       
    
    if (status == 'checkAvailability') {
      // console.log('status: '+ status);

      if ((operatorSocketIDOperatorChannel.length != undefined ) && (operatorSocketIDOperatorChannel.length != 0)){
        // console.log('operatorChannelStatus is Occupied');
        io.to(socket.id).emit('operatorChannelStatus', 'Occupied', socket.id );
      } else { // operatorSocketIDOperatorChannel is not empty
        // console.log('operatorChannelStatus is Available');
        io.to(socket.id).emit('operatorChannelStatus', 'Available', socket.id ); 
      }
    } 

    if (status == 'releaseOperatorChannel'){

      console.log('operatorSocketIDOperatorChannel: ' +operatorSocketIDOperatorChannel);
      console.log('operatorSocketIDOperatorChannelNonAndroid: ' +operatorSocketIDOperatorChannelNonAndroid);   

      operatorSocketIDOperatorChannel = '';
      operatorSocketIDOperatorChannelNonAndroid = '';
      console.log('operatorSocketIDOperatorChannel.length: ' +operatorSocketIDOperatorChannel.length);
      console.log('operatorSocketIDOperatorChannelNonAndroid.length: ' +operatorSocketIDOperatorChannelNonAndroid.length);   
  
    }

    if (status == 'channelIdle'){

      // operatorSocketIDOperatorChannel = '';
      // console.log('operatorSocketIDOperatorChannel: ' +operatorSocketIDOperatorChannel);
      // console.log('operatorSocketIDOperatorChannel.length: ' +operatorSocketIDOperatorChannel.length);   

      io.to(socket.id).emit('operatorChannelStatus', 'channelTimeout', socket.id ); 
      // release channel user is idled

      console.log('clear operator channel after user idle');
      // console.log('operatorSocketIDOperatorChannelNonAndroid: ' +operatorSocketIDOperatorChannelNonAndroid);   

      operatorSocketIDOperatorChannel = '';
      operatorSocketIDOperatorChannelNonAndroid = '';
      // console.log('operatorSocketIDOperatorChannel.length: ' +operatorSocketIDOperatorChannel.length);
      // console.log('operatorSocketIDOperatorChannelNonAndroid.length: ' +operatorSocketIDOperatorChannelNonAndroid.length);       


      dog.sleep();
    }

    if (status == 'stopWatchdog'){
      // console.log('stopWatchdog');

      // setTimeout(() => {
        dog.sleep();
        console.log('dog sleep');
      // }, 30000);  //30s

    }

    if (status == 'keepalive'){
      // console.log('operator channel keepalive');
      dog.feed(food); //feed the dog every 10s
      // dog.reset();
    }
  });
  
  socket.on('user', function(userid){
    // console.log("userid: " +userid);
    // console.log("sender: " +userid.sender);
    // console.log("package: " +userid.package);
    // try {
    //   if ((userid.sender != undefined) && (userid.package != undefined)) {
    //     // var userid = userid.sender;  
    //     // var package = userid.package;
    //     console.log("sender isJson " +userid.sender);
    //     console.log("package isJson " +userid.package);
    //   } else {
    //     // userid = userid;
    //     console.log("userid is not Json " +userid);
    //   }
            
    // } catch(e){
    //   console.log("Exception: userid is not JSON!!! ");
    // }
    // if (isJSON(userid) == true){
    //   console.log("userid: " +userid.sender);
    //   console.log("package: " +userid.package);
    // } else {
    //   console.log("userid: " +userid);
    // }
    console.log("socket.on(users)" +userid +" "+socket.id);
    if(userid=='admin'){
      adminSocketID.push(socket.id);
      // io.to(socket.id).emit('users',{users:userSocketIDAndUsername});  //orginal
      io.to(socket.id).emit('users', userid, socket.id); //Ben
      console.log("admin emit socket.on(users)" +socket.id);
      console.dir("print array " +adminSocketID);
      // console.log("emit socket.on(users)" +{users:userSocketIDAndUsername});
    } else if (userid == 'operator') {
      console.log("emit socket.on(operator)" +socket.id);
      operatorSocketIDOperatorChannel = socket.id;
      io.to(socket.id).emit('users', userid, socket.id); //Ben, just to get the socket id
    } else if (userid == 'operatorSessionUser'){
      console.log("emit socket.on(operatorSessionUser)" +socket.id);
      userSocketIDOperatorChannel = socket.id;
      operatorSessionUserConnected = true;
      // io.to(socket.id).emit('users', userid, socket.id); //Ben
    } else if (userid == 'operatorNonAndroid') {
      console.log("emit socket.on(operatorNonAndroid)" +socket.id);
      operatorSocketIDOperatorChannelNonAndroid = socket.id;
      io.to(socket.id).emit('users', userid, socket.id); //Ben, just to get the socket id
    } else if (userid == 'operatorSessionUserNonAndroid'){
      console.log("emit socket.on(operatorSessionUserNonAndroid)" +socket.id);
      userSocketIDOperatorChannelNonAndroid = socket.id;
    } else {
      console.log(' Customer Lu log userid is '+ userid);   //userid is tel number
      
      userSocketIDAndUsername.push(userid + ' (' + socket.id + ')');
      userSocketID.push(socket.id);
      username.push(userid);
     
      // for(var i in adminSocketID){
        //io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
          // orginal
          // io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername},socket.id);
          io.to(adminSocketID[0]).emit('users',userid,socket.id);
          // io.to(socket.id).emit('users',userid,socket.id);
          // io.to(adminSocketID[i]).emit('logRequest',userid,socket.id);
          console.log("emit customer socket.on(users)" +socket.id);
          // console.log("emit userSocketID " +socket.id);
          // console.log("emit username " +userid);

      // }
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
       //io.to(socket.id).emit('chat',socket.userid +': '+ msg);  //for chat request service
    //io.to(socket.id).emit('chat',socket.userid +': '+ JSON.stringify(msg.message)); //this is for original admin page demo
        
      io.to(atou[socket.id]).emit('adminchat',msg); //to android
    } else {  //customer message
      console.log(username[userSocketID.indexOf(socket.id)] + ' sending msg "' + msg + '" to admin');
      // io.to(socket.id).emit('chat',msg); // this is for original admin page demo
      io.to(utoa[socket.id]).emit('chat',msg);  //to android
    }
  });

  socket.on('disconnect', function(){
    if (socket.userid != null){

      // if ((socket.userid.sender !=undefined) && (socket.userid.package!=undefined)){
      //   io.to(utoa[socket.id]).emit('disconnect', socket.userid.sender); 
      //   console.log( 'user ' + socket.userid.sender + ' disconnected');
      //   console.log( 'user ' + socket.userid.package + ' disconnected'); 
      // } else {
      // io.to(utoa[socket.id]).emit('disconnect', socket.userid);
      // //io.to(utoa[socket.id]).emit('disconnect',socket.userid + " disconnected");
      // console.log(socket.userid + ' disconnected');
      // }

      if (socket.userid == 'admin'){
        // adminSocketID.pop();


        var index = adminSocketID.indexOf(socket.id);
        if (index > -1) {
          io.to(atou[socket.id]).emit('disconnect', socket.userid);
          console.dir("emit admin disconnect " +socket.userid +socket.id);
          adminSocketID.splice(index, 1);
        }

        console.dir("print array " +adminSocketID);
        console.log("remove admin socket.on(users) from array" +socket.id);
        


      }


      if ((socket.userid != 'admin') && (socket.userid !='transport close')){
        // userSocketIDAndUsername.pop(socket.userid + ' (' + socket.id + ')');
        // userSocketID.pop(socket.id);
        // username.pop(socket.userid);

        // console.log("remove userSocketID from array " +socket.id);
        // console.log("remove username from array " +socket.userid);
        

      // for(var i in adminSocketID){
      //   io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername});
      // }

        io.emit('customerQuit', socket.userid, socket.id);

        var index = userSocketIDAndUsername.indexOf(socket.userid + ' (' + socket.id + ')');
        if (index > -1) {
          userSocketIDAndUsername.splice(index, 1);
        }

        index = userSocketID.indexOf(socket.id);
        if (index > -1) {
          userSocketID.splice(index, 1);
        }

        index = username.indexOf(socket.userid);
        if (index > -1) {
          username.splice(index, 1);
        }

        for(var i in adminSocketID){
          // io.to(adminSocketID[i]).emit('users',{users:userSocketIDAndUsername}); //no need it new UI
        }
        console.log( 'user ' + socket.userid + ' disconnected');


        // update db request_status to 'Quit'if customer quit the queue, Ben

      }

      if (socket.userid == 'operatorSessionUser'){
        operatorSessionUserConnected = false;
        console.log( 'operatorSessionUser' + socket.userid + ' disconnected');
      }

      if ((socket.userid.sender !=undefined) && (socket.userid.package!=undefined)){
        io.to(utoa[socket.id]).emit('disconnect', socket.userid.sender); 
        console.log( 'user ' + socket.userid.sender + ' disconnected');
        console.log( 'user ' + socket.userid.package + ' disconnected'); 
      } else {
      io.to(utoa[socket.id]).emit('disconnect', socket.userid);
      //io.to(utoa[socket.id]).emit('disconnect',socket.userid + " disconnected");
      console.log(socket.userid + ' disconnected');
    }

    }
  });
  // end of "from johnson"


  // save-message
  socket.on('save-message', function (data) {
    console.log("save-message: " +data.package);
    io.emit('new-message', { message: data });
  });

  // save-image
  socket.on('save-image', function (data) {
    // console.log(data);
    console.log("new image in room: " +data.room);
    console.log("new message in image: " +data.message);
    console.log("new filename: " +data.filename);
    // io.emit('new-image', {message: data.message, filename: data.filename});
    io.emit('new-image', data);

  });

}); //io.on


// function isJSON(userid) {
//    var ret = true;
//    try {
//       JSON.parse(userid);
//       console.log("userid isJSON " );
//    }catch(e) {
//       ret = false;
//       console.log("userid is not JSON " );
//    }
//    return ret;
// }

/* GET ALL NON ROBOT CHATS, THIS IS THE REAL ROOM */
  // router.get('/:room', function(req, res, next) {
router.get('/:room', auth, function(req, res, next) {
  
  var lastMonth = Date.now() - (30*24*3600*1000);  //1 month = 30*24*3600*1000

  if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError:"
      });
  } else {
  // Chat.find({ room: req.params.room }, function (err, chats) {
    Chat.find({ $and:
      [
        { room: req.params.room },
        { socket_id: { $exists: true } }, 
        { nickname: { $ne:"robot" } },  //filter robot reply
        { updated_at: {$gte: lastMonth } }  //filter robot reply
      ]
      }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});

/* GET SINGLE CHAT BY ID */
router.get('/id/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* SAVE CHAT postman POST path:192.168.0.102:4080/chat/*/
router.post('/', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* UPDATE CHAT */
router.put('/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


/* GET chat request by socket id */
// router.get('/socket/:socket_id',  function(req, res, next) {
router.get('/socket/:socket_id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.find({socket_id:req.params.socket_id}, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* GET chat request by socket id */
// router.get('/show_id/:socket_id',  function(req, res, next) {
router.get('/show_id/:socket_id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.find({ $and:
      [
        { socket_id: req.params.socket_id },
        { operator_request: "Working" }, 
        { nickname: { $exists: false  } }  //filter robot reply
        // { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
      ]
      }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});


/* UPDATE chat request by socket id*/
// router.put('/socket/:socket_id', function(req, res, next) {
router.put('/socket/:socket_id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.findOneAndUpdate({socket_id:req.params.socket_id}, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* DELETE CHAT */
router.delete('/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


/* GET ALL REQUESTS 192.168.0.102:4080/chat/request/all*/ 
router.get('/request/all', auth, function(req, res, next) {
  if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError:"
      });
  } else {
    Chat.find(req.body, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});

/* GET ALL REQUESTS with phone# and socket id 192.168.0.102:4080/chat/requests/human*/ 
// router.get('/request/human', function(req, res, next) { 
router.get('/request/human', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.find({ $and: 
      [ 
        { phone_number: {  $exists: true } }, 
        { socket_id: { $exists: true } }, 
        { nickname: { $exists: false } },
        { operator_request: { $exists: false } }
        // { status: "New" } 
      ]
    }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }  //end else
});


/* GET ALL NEW REQUESTS COUNT */
router.get('/newrequest/human', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.count(
      { request_status: "New"   
    }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});


/* GET ALL REQUESTS with phone# and socket id 192.168.0.102:4080/chat/requests/human*/ 
router.get('/request/operator', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.find({ $and: 
      [ 
        { phone_number: { $exists: true } }, 
        { operator_request: { $exists: true } }
        // { status: "New" } 
      ]
    }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    })
  }
});

/* get staff session id count from staff model*/ 
// router.get('/staff/session_id', function(req, res, next) { 
router.get('/staff/session_id', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Staff.find({ $and: 
      [ 
        { tinkerSessionId: { $exists: true } },
        { tinkerSessionId: { $ne:"" } }
      ]
    }, function (err, staffs) {
      if (err) return next(err);
      res.json(staffs);
    })
  }
});

/* get staff online count from staff model*/ 
router.get('/staff/online_count', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Staff.count(      
    
      { online: "true"        
    
    }, function (err, staffs) {
      if (err) return next(err);
      res.json(staffs);
    })
  }
});

/* get staff online count from staff model*/ 
router.get('/staff/online_nickname', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Staff.find(      
    
      { online: "true"        
    
    }, function (err, staffs) {
      if (err) return next(err);
      res.json(staffs);
    })
  }
});

/* UPDATE operator channel */
// router.put('/request/operator_channel/:id', auth, function(req, res, next) {
//   if (!req.payload._id) {
//     res.status(401).json({
//       "message" : "UnauthorizedError:"
//     });
//   } else {  
//     Staff.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//       if (err) return next(err);
//       res.json(post);
//     });
//   }
// });

// db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )

/* GET ALL CHATS in the room 192.168.0.102:4080/chat/roomhistory/phone#*/ 
router.get('/roomhistory/:room', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.find({ room: req.params.room }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});


/* SAVE REQUEST */
// router.post('/request', function(req, res, next) {
  router.post('/request', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* UPDATE REQUEST */
router.put('/request/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* DELETE REQUEST */
router.delete('/request/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


/* GET ALL USERS in same room 192.168.0.102:4080/chat/user/all*/ 
// router.get('/user/all', function(req, res, next) {
router.get('/user/all', auth, function(req, res, next) {
 if (!req.payload._id) {
   res.status(401).json({
     "message" : "UnauthorizedError:"
   });
 } else {  
    User.find( req.body, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
 }
});

/* GET SINGLE user BY ID */
// router.get('/user/:id', auth, function(req, res, next) {
//   if (!req.payload._id) {
//     res.status(401).json({
//       "message" : "UnauthorizedError:"
//     });
//   } else {  
//     User.findById(req.params.id, function (err, post) {
//       if (err) return next(err);
//       res.json(post);
//     });
//   }
// });

/* UPDATE user */
// router.put('/user/:id', function(req, res, next) {
//   User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* GET SINGLE user BY phone_number */
// router.get('/userphone/:phone_number', function(req, res, next) {
router.get('/userphone/:phone_number', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    User.find({phone_number:req.params.phone_number}, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  }
});

/* SAVE user */
// router.post('/user', function(req, res, next) {
router.post('/user', auth, function(req, res, next) {
 if (!req.payload._id) {
   res.status(401).json({
     "message" : "UnauthorizedError:"
   });
 } else {  
    User.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
 }
});

/* UPDATE user by user phone number*/
// router.put('/userupdate/:phone_number', function(req, res, next) {
router.put('/userupdate/:phone_number', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    User.findOneAndUpdate({phone_number:req.params.phone_number}, req.body, function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  }
});

/* DELETE user */
router.delete('/userdelete/:phone_number', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else { 
    User.findOneAndRemove({phone_number:req.params.phone_number}, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


// Get image
/* GET ALL USERS in same room 192.168.0.102:4080/chat/image/all*/ 
router.get('/image/all', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    // Chat.find( req.body, function (err, images) {
     Chat.find({ $and:
      [
        // { room: req.params.room },
        { filename: { $exists: true } }, 
        { nickname: { $exists:true, $ne:"robot" } }  //filter robot reply
      ]
    }, function (err, images) {  
      if (err) return next(err);
      res.json(images);
    });
  }
});

/* GET IMAGE BY ROOM, THIS IS THE REAL ROOM */
// router.get('/image/:room', function(req, res, next) {
router.get('/image/:room', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    // Chat.find({ room: req.params.room }, function (err, chats) {
      Chat.find({ $and:
      [
        { room: req.params.room },
        { filename: { $exists: true } },  //image filename exist
        { nickname: {$exists:true, $ne:"robot" } }  //filter robot reply
      ]
      }, function (err, chats) {
      if (err) return next(err);
      res.json(chats);
    });
  }
});

/* GET SINGLE image BY ID */
router.get('/imageid/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


/* SAVE image */
router.post('/image', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Chat.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});


/* DELETE image */
router.delete('/image/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

//get all contact id
// router.get('/contact/all', function(req, res, next) { 
router.get('/contact/all', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    Contact.find(req.body, function (err, contacts) {
      if (err) return next(err);
      res.json(contacts);
    })
  }  //end else
});

// get id using name and package type
// router.get('/contact/:name', function(req, res, next) { 
router.get('/contact/:name', auth, function(req, res, next) { 
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {
    // Contact.find({name:req.params.name}, function (err, contacts) {
      var search = req.params.name;
    Contact.find({'name': new RegExp(search,'i')}, function (err, contacts) {
      if (err) return next(err);
      res.json(contacts);
    })
  }  //end else
});

/* SAVE contact */
// router.post('/contact', function(req, res, next) {
router.post('/contact', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Contact.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* UPDATE contact */
// router.put('/contact/:id', function(req, res, next) {
router.put('/contact/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Contact.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* DELETE conact */
// router.delete('/contact/:id', function(req, res, next) {
router.delete('/contact/:id', auth, function(req, res, next) {
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError:"
    });
  } else {  
    Contact.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* GET SINGLE CHAT BY ID */
// router.get('/dbstats/storage', auth, function(req, res, next) {
//   if (!req.payload._id) {
//     res.status(401).json({
//       "message" : "UnauthorizedError:"
//     });
//   } else {
//     Chat.find(req.body, function (err, chats) {
//       if (err) return next(err);
//       res.json(chats);
//     });
//   }
// });

module.exports = router;
