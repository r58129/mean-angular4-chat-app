import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';
import { AuthService, UserDetails } from '../auth/auth.service';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
// import {Keepalive} from '@ng-idle/keepalive';


@Component({
  selector: 'app-opchat',
  templateUrl: './opchat.component.html',
  styleUrls: ['./opchat.component.css']
})
export class OpchatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  // @ViewChild('image') private myInputImage: any;
  // @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  //Ben
  @HostBinding('class.search-user') 
  searchUser: any;

  url = '';
  ImageObject = {};
  displayImage = '';
  display_socket_id: any;
  selectedFile: File;
  chats: any =[];
  joinned: boolean = false;
  connected: boolean = false;
  notSelected: boolean = true;
  appName: string;  // appName=whatsapp means from android, nonwhatsapp = from non android
  package: string;
  requestId: any=[];
  requestCount:any;
  timer: any;

  // details: UserDetails;

  newUser = { type:'', nickname: '',socket_id: '', room: '' , db_id:'', operator_request:'', people_in_room:''};  //for operator
  newOpRequest = { type:'', phone_number: '', socket_id: '', room:'', message: '', operator_request:'', people_in_room:'' };  //for customer
  msgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  imgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: '' };
  CusImgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '', file_path:'', image: '' };  
  CusMsgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  //socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});
  
  constructor(private chatService: ChatService, private authService: AuthService, private router: Router, 
    private route: ActivatedRoute, private configs: Configs, private idle: Idle) {
    
    // sets an idle timeout of 50 seconds, for testing purposes.
    idle.setIdle(50); //50
    // sets a timeout period of 10 seconds. after 60 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(10);  //10
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      // this.idleState = 'No longer idle.';
      console.log('No longer idle.');
    });
    
    idle.onTimeout.subscribe(() => {
      
      if ((sessionStorage.getItem("emittedOpeartorSocket") == undefined) || (sessionStorage.getItem("emittedOpeartorSocket") == '0')){
        console.log(' Do not emit operator channel idle!');
      } else {
        console.log(' Operator channel idle!');
        this.socket.emit('operatorChannel','channelIdle');    
      }

      
      // this.idleState = 'Timed out!';
      // this.timedOut = true;
    });
    
    idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!');
      // this.idleState = 'You\'ve gone idle!';
    });
    
    idle.onTimeoutWarning.subscribe((countdown) => {
      console.log('You will time out in ' + countdown + ' seconds!');
      // this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    // keepalive.interval(15);

    // keepalive.onPing.subscribe(() => {
    //   // this.lastPing = new Date()
    // });

    this.reset();
  }

  ngOnInit() {

    this.chatService.change.subscribe(searchUser => {
      console.log("this.searchUser.id: "+searchUser.id);
      console.log("this.searchUser.package: "+searchUser.package);
      this.newUser.room = searchUser.id;
      this.newUser.type = searchUser.package;

      // console.log("this.searchUser.name: "+this.searchUser.name);
    });

    // this.route.params.subscribe(params =>{
    //     // console.log(params);
    //     this.newUser.room = params['id'];
    //     console.log(this.newUser.room);     
    // });
    // this.route.params.subscribe(params =>{
    //     // console.log(params);
    //     this.newUser.type = params['id2'];
    //     console.log(this.newUser.type);     
    // });

    var user = JSON.parse(sessionStorage.getItem("user"));

    // Do not emit again while page refresh

    this.socket.emit('operatorChannel','checkAvailability');  


    this.socket.on('operatorChannelStatus', (status, socketID) =>{
      console.log('operatorChannelStatus: ' +status +socketID);
      // localStorage.setItem("mySocket", socketID);

      if (status == 'Available'){
        console.log('Emit operator user sockets');

        //Emit opeartor user socket

        sessionStorage.setItem("emittedOpeartorSocket", socketID);

        this.socket.emit('user','operator');
        this.socket.emit('user','operatorNonAndroid');

        this.socket.emit('operatorChannel','keepalive');  

      } 
      
      if (status == 'Occupied') {  //occupied

        if ((sessionStorage.getItem("emittedOpeartorSocket") == undefined) || (sessionStorage.getItem("emittedOpeartorSocket") == '0')){

          sessionStorage.setItem("emittedOpeartorSocket", "0");
          this.router.navigate(['/chat/request']); 
          window.alert('Operator Channel is occupied. Redirect to Administrator page!');


        } else {  //there is sID in local storage
          console.log('socketID: ' +socketID)
          // if (localStorage.getItem("mySocket") == socketID){

            // window.alert('Operator socket is refreshed. Redirect to Administrator page!');
            // this.router.navigate(['/chat/request']);
            // console.log('do not update local storage');
            console.log(' emit operator user socket and update local storage sID after page is refreshed');  
            this.socket.emit('user','operator');
            this.socket.emit('user','operatorNonAndroid');
            sessionStorage.setItem("emittedOpeartorSocket", socketID);
          
            // need to update new socket to local storage

          // } else {  // in case node reset the opeartor channel because of idle and other one is using the channel
          //   localStorage.setItem("emittedOpeartorSocket", "0");
          //   window.alert('Operator Channel is occupied. Redirect to Administrator page!');
          //   this.router.navigate(['/chat/request']);

          // }
        }
      } 

      if (status == 'channelTimeout'){
        console.log('Channel Timeout: ' +socketID);
        sessionStorage.setItem("emittedOpeartorSocket", "0");
        
        // //force exit of the chat window
        // this.joinned = false;  

        var updateStatus = { operator_request:"Timeout", people_in_room:"0"};
  

        if ((this.newUser.room !='') && (this.newUser.type!='')){
          
          console.log(this.newUser.room );

          this.chatService.getIdBySocket(socketID).then((result) => {
            this.requestId = result;
            

            if (this.requestId[0] != undefined){

              console.log("request._id: " +this.requestId[0]._id);

              this.chatService.updateChat(this.requestId[0]._id, updateStatus).then((res) => {  //from chatService
                console.log("Timeout status updated");


                var timeout = "Operator Timeout!";
                this.SendForm(timeout);
                console.log("Operator Timeout");                

                // this.Disconnect(this.newUser.room);

                if (this.appName == 'whatsapp'){ 
                  console.log("disconnectuserOperatorSession: " +this.newUser.room);
                  this.socket.emit('disconnectuserOperatorSession', this.newUser.room);
                } else if (this.appName == 'nonwhatsapp') {
                  console.log("disconnectuserOperatorSessionNonAndroid: " +this.newUser.room);
                  this.socket.emit('disconnectuserOperatorSessionNonAndroid', this.newUser.room);
                }                 

                // this.socket.emit('operatorChannel','releaseOperatorChannel');
                sessionStorage.removeItem('user');

                //force exit of the chat window
                this.joinned = false;  
               
                this.router.navigate(['/chat/request']); 
                // window.alert('Operator Channel Timeout!');

              }, (err) => {
                console.log(err);
                
              });
            } else {

              console.log('Timeout without update DB!');
            }

          }, (err) => {
            console.log(err);
          });         
        } else {
          console.log(' No user is found');
          sessionStorage.removeItem('user');          
          this.router.navigate(['/chat/request']); 
          // window.alert('Operator Channel Timeout!');

        }



      }
    });

    // this.socket.emit('user','operator');

    // //For non android chat apps
    // this.socket.emit('user','operatorNonAndroid');

  
    this.chatService.getNASocketIo().then((res) => {  //from chatService
    // this.naSocketId = res;
      console.log('get socketid from mutlichat service' +res);
    }, (err) => {
      console.log(err);
    });

    this.socket.on('users', (userid, socket_id) => {

      var date = new Date();
      // console.log("inside users socket.on");
      // if ((userid.sender != undefined) && (userid.package != undefined)){
      //   this.package = userid.package;
      //   userid = userid.sender;
      //   console.log("print userid.sender: " +userid);
      //   console.log("print userid.package: " +this.package);
      //   console.log("print socket.id:" +socket_id);
      // } else {
      //   userid = userid;
      //   this.package = 'whatsapp';
      //   console.log("print userid: " +userid);
      //   console.log("print package: " +this.package);
      //   console.log("print socket.id:" +socket_id);
      // }

      this.newUser.socket_id = socket_id;

     //customer will join the room while operator won't do it again.
     // if (userid != 'operator'){ 
     if ((userid != 'operator') && (userid != 'operatorNonAndroid')){ 
     // use status field to classify the new and old request
     this.newOpRequest = {type: this.newUser.type, phone_number: userid, socket_id: socket_id, room: userid, message: 'Customer joined', operator_request:'Working', people_in_room:'2' };
       // console.log(this.newOpRequest.room);
       console.log(this.newOpRequest.phone_number);
       console.log(this.newOpRequest.socket_id);
       console.log(this.newOpRequest.message);
       console.log(this.newOpRequest.operator_request);
       console.log(this.newOpRequest.type);
       // // console.log(this.newRequest.updated_at);

      // this.chatService.saveRequest(this.newRequest).then( function(result)  {
      this.chatService.saveRequest(this.newOpRequest).then((result) => {
        // this.request = result;
        // console.log("id: " + this.request._id);
        this.socket.emit('save-message', result);
        }, (err) => {
          console.log(err);
        });
      }    //if 
    });

    this.socket.on('chat', (msg) =>{
      // this.socket.on('chat', (userid, msg) =>{
      if (sessionStorage.getItem("user")!=null){      
        var date = new Date();
        console.log("print customer message object: " +msg);

        // modify this to json object
        var obj = JSON.parse(msg);
        var phoneNum = obj.sessionID;
        var message = obj.message;
        var filePath = obj.photoPath;

        console.log("print customer phoneNum:" +phoneNum);
        console.log("print customer message:" +message);
        console.log("print customer photoPath:" +filePath);

        if (msg !== 'undefine'){

          if (!message.includes('\uD83D\uDCF7')){  //msg is text
          // if (filePath == 'nonwhatsapp'){
          
          //   this.appName = 'nonwhatsapp';
          //   console.log('filePath in nonwhatsapp : ' +filePath);
          //   console.log('text message in nonwhatsapp : ' +this.appName);
          // } else {
          //   this.appName = 'whatsapp';
          //   console.log('text message from in whatsapp: ' +this.appName);
          // }
      
          this.CusMsgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message };
          // console.log(this.CusMsgData.room);
          // console.log(this.CusMsgData.phone_number);
          // console.log(this.CusMsgData.socket_id);
          // console.log(this.CusMsgData.message);
          
          this.chatService.saveChat(this.CusMsgData).then((result) => {
            this.socket.emit('save-message', result);
          }, (err) => {
            console.log(err);
          });
          } else { //else msg is image (message.includes('\uD83D\uDCF7'))

            if ((!filePath) || (filePath == "Timeout")){
            console.log("filePath is null or Timeout");

            this.CusMsgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: "Sent Photo Failed!" };
            // console.log(this.CusMsgData.room);
            // console.log(this.CusMsgData.phone_number);
            // console.log(this.CusMsgData.socket_id);
            // console.log(this.CusMsgData.message);
          
            this.chatService.saveChat(this.CusMsgData).then((result) => {
              this.socket.emit('save-message', result);
            }, (err) => {
              console.log(err);
            });

            } else {  // else (filePath !== 'Timeout')
              if (filePath == 'nonwhatsapp'){
                // extract non whatsapp image from message
                // var base64header = ((message).split(".")[1]);
                var base64Image = ((message).split(".")[1]);
                console.log('base64Image: ' +base64Image);

                //save to DB 
                this.CusImgData = { type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: '', file_path:filePath, image:base64Image };
                console.log('receive image from customer');
                console.log(this.CusImgData.room);
                console.log(this.CusImgData.phone_number);
                console.log(this.CusImgData.socket_id);
                console.log(this.CusImgData.message);
                console.log(this.CusImgData.image);
                console.log(this.CusImgData.file_path);

                this.chatService.saveImage(this.CusImgData).then((result) => {
                  console.log('save data to DB');
                  this.socket.emit('save-image', result);
                }, (err) => {
                  console.log(err);
                });
              } else {  // whatsapp flow will provide valid file path
              // get admin sessionID
              var sID=localStorage.getItem('res.data.sessionID');
              var fileType = ((filePath).split(".")[1]);
              var path = 'sessionID='+sID +'&path='+filePath;
              // var completePath = 'https://airpoint.com.hk:'+sessionStorage.getItem("tinkerport")+'/api/csp/getimage?'+path;  //save complete path to db
              var completePath = 'https://airpoint.com.hk:'+this.configs.tinkerport+'/api/csp/getimage?'+path;  //save complete path to db

              console.log("sID: " + sID);
              console.log("tinkerPath: " + filePath);
              console.log("complete path: " + completePath);
              console.log("fileType: " + fileType);

              this.chatService.getImageFromNode(path).then((res) => {  //from chatService
                console.log(" get image from tinker");
            
                var blob = new Blob(
                  [res],
                  // Mime type is important for data url
                  // {type : 'text/html'}
                  {type : 'image/' +fileType}
                  );


                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend =(evt:any) =>{
                // Capture result here
                var getImage = evt.target.result;
                console.log(evt.target.result);

                this.CusImgData = {type: this.newUser.type, phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message, file_path:completePath, image:getImage };
                console.log('receive image from customer');
                console.log(this.CusImgData.room);
                console.log(this.CusImgData.phone_number);
                console.log(this.CusImgData.socket_id);
                console.log(this.CusImgData.message);
                console.log(this.CusImgData.image);
                console.log(this.CusImgData.file_path);

                this.chatService.saveImage(this.CusImgData).then((result) => {
                  console.log('save Image from tinker');
                  this.socket.emit('save-image', result);
                }, (err) => {
                  console.log(err);
                });

              };
           

              }, (err) => {
                console.log(err);
              });
        
                //sessionID=193bc1f1-9799-40e7-a899-47b3aa1fbde3&path=/storage/emulated/0/WhatsApp/Media/WhatsApp%20Images/avator105.jpg
              }  // end else whatsapp flow will provide valid file path
            }  // end else (filePath == 'nonwhatsapp')
          }  //end else (message.includes('\uD83D\uDCF7'))
        }  // end if (msg !== 'undefine')
      }  // end if (localStorage.getItem("user")!=null)
    });

    // User disconnect chat in operation mode
    // this.socket.on('disconnect', function(userid){
    //   console.log('Disconnect: ' + userid);
    //   var message = "User is disconnected!";
 
    //  this.CusMsgData = { phone_number: userid, socket_id: 'socket_id', room:userid , nickname:userid , message: message };
    //     console.log(this.CusMsgData.room);
    //     console.log(this.CusMsgData.phone_number);
    //     console.log(this.CusMsgData.socket_id);
    //     console.log(this.CusMsgData.message);
      
    //     this.chatService.saveChat(this.CusMsgData).then((result) => {
    //     this.socket.emit('save-message', result);
    //     }, (err) => {
    //       console.log(err);
    //     });
    // }.bind(this));
    // end of from johnson


    if(user!==null) {
      // this.getChatByRoom(user.room);  //from chatService
      // this.getRequestByRoom(request.phone_number);  //testing
      this.msgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    
    this.socket.on('new-message', function (data) {
      // console.log("data.message.room: " + data.message.room);
      // console.log("JSON.parse(localStorage.getItem('user')).room: " + (JSON.parse(localStorage.getItem("user")).room));
      // console.log("phone#: " + data.message.room);
      
      if (sessionStorage.getItem("user")!=null){
        console.log("new-message: " + data.message.message);
        if(data.message.room === JSON.parse(sessionStorage.getItem("user")).room) {
        user=JSON.parse(sessionStorage.getItem("user"));
        this.chats.push(data.message);
        this.msgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
            }
        }
    }.bind(this));


    this.socket.on('new-image', function (data) {
      
      if (sessionStorage.getItem("user")!=null){
        console.log("new-image: " + data.room);

        if(data.room === JSON.parse(sessionStorage.getItem("user")).room) {
          console.log("new-image inside if: " + data.room);

          if (data.filename !== 'undefined'){
          // this.chats.push(data.message, data.filename);
          console.log("new-image: " + data.filename);
          this.chats.push(data);
          this.imgData = { type: user.type, phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '', 
          filename: user.filename, image: user.image}
          // this.RetrievePhoto(data);
          this.scrollToBottom();
          }
        }
      }
      
    }.bind(this));

    // console.log(this.ImageObject);

    this.timer = setInterval(() => {

      if ((sessionStorage.getItem("emittedOpeartorSocket") != undefined) && (sessionStorage.getItem("emittedOpeartorSocket") != '0')){
    
      this.socket.emit('operatorChannel','keepalive');  
      console.log("operator channel keepalive");
      }
   
    }, 10000); //emit keepalive socket everytime 10s =10000

  }

  ngOnDestroy(){

    if ((sessionStorage.getItem("emittedOpeartorSocket") == undefined) || (sessionStorage.getItem("emittedOpeartorSocket") == '0')){

        console.log('Do not releaseOperatorChannel, do not stop dog and set emittedOpeartorSocket to 0');
        sessionStorage.setItem("emittedOpeartorSocket", "0");
        // window.alert('Operator Channel is occupied. Redirect to Administrator page!');
        // this.router.navigate(['/chat/request']); 

    } else { // localStorage.getItem("emittedOpeartorSocket") !='0'
        // if (localStorage.getItem("emittedOpeartorSocket") == socketID){

          console.log('releaseOperatorChannel and set emittedOpeartorSocket to 0');
          this.socket.emit('operatorChannel','releaseOperatorChannel');
          this.socket.emit('operatorChannel','stopWatchdog');
          sessionStorage.setItem("emittedOpeartorSocket", "0");
          

    }


    this.socket.disconnect();
    
    if (this.timer){
      clearInterval(this.timer);
    
    }


    console.log('operator ngOnDestroy');
    
    // reset timeOut and idle count
    // this.reset();
  }

  ngAfterViewChecked(){

    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    console.log("inside getChatbyRoom" +room);
    this.chatService.getChatByRoom(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  opJoinRoom() {   //operator join room
    // var socket_id =this.socket_id;
    // console.log('operator joinRoom using phone#: ' +this.newUser.room);

    // this.Connect(this.newUser.room);  //operator join this room
    
    // // check if operator channel is occupied
    // this.chatService.checkOperatorChannel().then((res) => {  //from chatService, 
    //   this.requestCount = res;
    //   console.log("operator_request: " + JSON.stringify(this.requestCount));
    //   if (this.requestCount == 0){  // need to check
        
        console.log('type:' +this.newUser.type );
        // select which app you connected to
        if (this.newUser.type == 'whatsapp'){
          this.appName = 'whatsapp';
          console.log('text message from in whatsapp: ' +this.newUser.type);
          console.log("operator join the room: " +this.newUser.room);
          this.socket.emit('connectuserOperatorSession', this.newUser.room);  
        } else {
          this.appName = 'nonwhatsapp';
          this.package = this.newUser.type;
          console.log('operatorNonAndroid connect to : ' +this.newUser.type);
          console.log("operatorNonAndroid join the room: " +this.newUser.room);
          this.socket.emit('connectuserOperatorSessionNonAndroid', this.newUser.room);  
        }
        
      var date = new Date();

      sessionStorage.setItem("user", JSON.stringify(this.newUser));
      this.getChatByRoom(this.newUser.room);
    
      this.msgData = {type: this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    
      this.joinned = true;
    
      this.socket.emit('save-message', { type: this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: ' Operator joined', updated_at: date });

    //   } else {

    //     this.joinned = false;
    //     window.alert('Operator Channel is in use!')

    //   }
    // }, (err) => {
    //   console.log(err);
    // }); 

  }

  sendMessage() {
    var message = this.msgData.message;

    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
    this.SendForm(message);
  }

  logout() {
    console.log("disconnect customer and operator, then logout");
    var date = new Date();
    var room =this.newUser.room;
    var user = JSON.parse(sessionStorage.getItem("user"));
    var updateStatus = { operator_request:"Done", people_in_room:"0"};
    var socketId = this.newOpRequest.socket_id;
    
    // this.socket.emit('save-message', { type:user.type, phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    // localStorage.removeItem("user");
    // this.joinned = false;

    console.log("this.newOpRequest.socket_id: " +socketId);

    this.chatService.getIdBySocket(socketId).then((result) => {
        this.requestId = result;

        // console.log("request.type: " +this.requestId[0].type);
        // console.log("request.socket_id: " +this.requestId[0].socket_id);
        // console.log("request.operator_request: " +this.requestId[0].operator_request);

        if (this.requestId[0] != undefined){
          console.log("request._id: " +this.requestId[0]._id);
          this.chatService.updateChat(this.requestId[0]._id, updateStatus).then((res) => {  //from chatService
            console.log("status updated");

            this.socket.emit('save-message', { type:user.type, phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
            sessionStorage.removeItem("user");
            this.joinned = false;
          
          //send goodbye message before logout()
            var goodbye = "goodbye";
            this.SendForm(goodbye);
            console.log(" send goodbye");

            this.Disconnect(room);

          }, (err) => {
            console.log(err);
          });
        } else {

          this.socket.emit('save-message', { type:user.type, phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
          sessionStorage.removeItem("user");
          this.joinned = false;
          
          //send goodbye message before logout()
          var goodbye = "goodbye";
          this.SendForm(goodbye);
          console.log(" send else goodbye");

          this.Disconnect(room);
      }

      }, (err) => {
        console.log(err);
    });


    

    //send goodbye message before logout()
    // var goodbye = "goodbye";
    // this.SendForm(goodbye);
    // console.log("goodbye");

    // this.Disconnect(room);

  }

  SendForm(message){
    if (this.appName == 'whatsapp'){ 
      console.log("operator is sending a message: " +message);
      // this.socket.emit('chat message',message);  //from admin to customer
      var obj = { type:"text", path:"null", message: message };
      this.socket.emit('chatMessageOperatorSession', obj);  //send json object from op to customer
      console.log("operator is sending object: " +obj);
      // return false;
    } else if (this.appName == 'nonwhatsapp') {
      console.log("operatorNonAndroid is sending a message: " +message);
      // this.socket.emit('chat message',message);  //from admin to customer
      var objNA = { type:"text", path:"null", message: message, sender:this.newUser.room, package: this.newUser.type };
      this.socket.emit('chatMessageOperatorSessionNonAndroid', objNA, this.newUser.type);  //send json object from op to customer
      console.log("operatorNonAndroid is sending object: " +objNA + this.newUser.type);

    }

  }

  Disconnect(phone_number){
    if (this.appName == 'whatsapp'){ 
      console.log("disconnectuserOperatorSession: " +phone_number);
      this.socket.emit('disconnectuserOperatorSession', phone_number);
    } else if (this.appName == 'nonwhatsapp') {
      console.log("disconnectuserOperatorSessionNonAndroid: " +phone_number);
      this.socket.emit('disconnectuserOperatorSessionNonAndroid', phone_number);
    }          
  }

  opSelectPhoto() {
    console.log('inside select Photo' );
    this.notSelected = false;
    this.url ='';
  }


  onOpFileSelected(event) {    

    this.selectedFile = event.target.files[0];
    console.log("event.target.files[0]: " +this.selectedFile);
    console.log("onOpFileSelected: " +this.selectedFile.name);
    // console.log("event.target.files: " +event.target.files);  //file list

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile); // read file as data url
      // reader.readAsArrayBuffer(event.target.files[0]);  //read as Array buffer
      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
        console.log("url: " +this.url);    //base64

      }
    }
  }
 
  SendPhoto(){

    console.log("admin is sending a photo: " +this.selectedFile );
    console.log("filename: " +this.selectedFile.name );
    console.log("nickname: " + this.newUser.nickname);
    console.log("room: " + this.newUser.room);
    console.log("socket_id: " + this.newUser.socket_id);
    console.log("message: " + this.msgData.message);
    console.log("flow: " + this.appName);
    console.log("type: " + this.newUser.type);

    var flow = this.appName;
    console.log("appname: " + flow);    

    //save to DB
    this.imgData = {type:this.newUser.type, phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, 
      // message: this.msgData.message, filename: this.selectedFile.name, image:uploadImage }; 
            message: this.msgData.message, filename: this.selectedFile.name, image:this.url }; 

    this.chatService.saveImage(this.imgData).then((result) => {
      console.log('inside saveImage');
      this.socket.emit('save-image', result);
    }, (err) => {
      console.log(err);
    });
    
    if (this.appName == 'whatsapp'){
    // get admin sessionID
    var sID=localStorage.getItem('res.data.sessionID');
    
    //construct form data
    var formDataImage = new FormData();
    formDataImage.append('sessionID', sID);
    formDataImage.append('imagefilename', this.selectedFile.name);
    formDataImage.append('imagefile', this.selectedFile);

    console.log('formDataImage.sessionID: ' +sID);
    console.log('formDataImage.imagefilename: ' +this.selectedFile.name);
    // console.log('formDataImage.imagefile: ' +this.url);  //base64
    
    //post formdata to tinker
    this.chatService.postImage2Node(formDataImage).then((res) => {  //from chatService
      console.log("Image posted to tinker");
    }, (err) => {
      console.log(err);
    });

    //emit socket to android
    // console.log("admin is sending a photo: " +onFileSelected.fileName);
    var jsonMesg = {type:'', path:'', message:''};
    jsonMesg.type = "image";
    jsonMesg.path = "/storage/emulated/0/" +this.selectedFile.name;
    jsonMesg.message = this.msgData.message;
    console.log('jsonMesg.type: ' +jsonMesg.type);
    console.log('jsonMesg.path: ' +jsonMesg.path);
    console.log('jsonMesg.message: ' +jsonMesg.message);
    
    this.socket.emit('chatMessageOperatorSession', jsonMesg);
    this.notSelected = true;

    } else if (this.appName == 'nonwhatsapp') {  // this is for non android flow

      console.log('skip posting to tinker board');
      var jsonMesgNA = {type:'', path:'', message:'', sender:'', package:''};
      jsonMesgNA.type = "image";
      jsonMesgNA.path = this.selectedFile.name;

      // jsonMesg.message = this.url;
      jsonMesgNA.message = ((this.url).split(",")[1]);
      console.log('jsonMesg.type: ' +jsonMesgNA.type);
      console.log('jsonMesg.path: ' +jsonMesgNA.path);
      console.log('jsonMesg.message: ' +jsonMesgNA.message);

      jsonMesgNA.sender = this.newUser.room;
      jsonMesgNA.package = this.newUser.type;

            // var objNA = { type:"text", path:"null", message: message, sender:this.newUser.room, package: "wechat" };
      // this.socket.emit('chatMessageOperatorSessionNonAndroid', objNA, "wechat");  //send json object from op to customer
      // console.log("operatorNonAndroid is sending object: " +objNA +" wechat");
      
      this.socket.emit('chatMessageOperatorSessionNonAndroid', jsonMesgNA, this.newUser.type);
      this.notSelected = true;

    }

  }

  CancelPhoto(){
    console.log('clicked cancel Photo' );
    this.notSelected = true;
  }

  reset() {
    this.idle.watch();
    console.log('idleState = Started');
    // this.idleState = 'Started.';
    // this.timedOut = false;
  }

}

