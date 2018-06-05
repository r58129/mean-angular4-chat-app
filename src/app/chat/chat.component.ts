import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  //Ben

  chats: any;
  joinned: boolean = false;
  notSelected: boolean = true;
  newUser = { nickname: '', room: '' ,socket_id: ''};
  msgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'' };
  //new request
  // requests: any;  //new request
  CusMsgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  socket = io('https://192.168.0.102:3637',{secure: true});
  
  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    // console.log("inside chat constructor" +this.route.snapshot.params);
  }

  ngOnInit() {
      history.pushState({},"Edit","");

    this.route.params.subscribe(params =>{
      console.log(params);
      this.newUser.room = params['id'];
      console.log(this.newUser.room);     
    });

    this.route.params.subscribe(params =>{
      // console.log(params);
      this.newUser.socket_id = params['id2'];
      console.log(this.newUser.socket_id);     
    });

    var user = JSON.parse(localStorage.getItem("user"));
    // var request = JSON.parse(localStorage.getItem("request"));

  this.socket.on('chat', (msg) =>{
  // this.socket.on('chat', (userid, msg) =>{
    var date = new Date();
    console.log("print customer message object:" +msg);

    // modify this to json object
    var obj = JSON.parse(msg);
    var phoneNum = obj.sessionID;
    var message = obj.message;

    console.log("print customer phoneNum:" +phoneNum);
    console.log("print customer message:" +message);

    if (msg !== 'undefined'){
    
    this.CusMsgData = { phone_number: phoneNum, socket_id: 'socket_id', room:phoneNum , nickname:phoneNum , message: message };
      console.log(this.CusMsgData.room);
      console.log(this.CusMsgData.phone_number);
      console.log(this.CusMsgData.socket_id);
      console.log(this.CusMsgData.message);
      
      this.chatService.saveChat(this.CusMsgData).then((result) => {
      this.socket.emit('save-message', result);
      }, (err) => {
        console.log(err);
      });
    }
  });

  this.socket.on('disconnect', function(msg){
    console.log('Disconnect: ' +msg);
 
  });
  // end of from johnson


    if(user!==null) {
      // this.getChatByRoom(user.room);  //from chatService
      // this.getRequestByRoom(request.phone_number);  //testing
      this.msgData = { phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
    }
    
    this.socket.on('new-message', function (data) {
      console.log("data.message.room: " + data.message.room);
      console.log("JSON.parse(localStorage.getItem('user')).room: " + (JSON.parse(localStorage.getItem("user")).room));
      
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats.push(data.message);
        this.msgData = { phone_number: user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    // this.scrollTableToBottom();
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

  joinRoom() {
    var socket_id =this.newUser.socket_id;
    console.log('joinRoom using socket_id: ' +socket_id);
    this.Connect(socket_id);  //connect to customer socket
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { phone_number:this.newUser.room, socket_id: this.newUser.socket_id, room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
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
    console.log("disconnect customer and logout the room");
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { phone_number:user.room, socket_id: user.socket_id, room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
  }

  SendForm(message){
    console.log("admin is sending a message: " +message);
    // this.socket.emit('chat message',message);  //from admin to customer
    var obj = { type:"text", path:"null", message: message };
    this.socket.emit('chat message', obj);  //send json object from admin to customer
    console.log("admin is sending object: " +obj);
    // return false;
  }

  Connect(socket_id){
    console.log("admin join the room with socket_id: " +socket_id);
     this.socket.emit('connectuser', socket_id);
   
    // return false;
  }

  selectPhoto() {
    console.log('inside select Photo' );
    this.notSelected = false;
    
  }

// export class MyFileUploadComponent {
  onFileSelected(event) {    
    let file = event.target.files[0];
    let name = file.name;
    console.log("onFileSelected: " +name);
  }
// }
 
  SendPhoto(filename){

    // this.chatService.saveImage();


    console.log("admin is sending a photo: " +filename );
    console.log("nickname: " + this.newUser.nickname);
    console.log("room: " + this.newUser.room);
    console.log("socket_id: " + this.newUser.socket_id);
    console.log("socket_id: " + this.msgData.message);
  
    // this.socket.emit('chat message',message);  //from admin to customer
    // var obj = { type:"photo", path:"null", message: message };
    // this.socket.emit('chat message', obj);  //send json object from admin to customer
    // console.log("admin is sending object: " +obj);
    // return false;
    
    // console.log("admin is sending a photo: " +onFileSelected.fileName);
    var jsonMesg = {type:'', path:'', message:''};
    jsonMesg.type = "image";
    jsonMesg.path = "/storage/emulated/0/" +filename;
    // jsonMesg.message = msg;
    jsonMesg.message = this.msgData.message;
    console.log('jsonMesg.type: ' +jsonMesg.type);
    console.log('jsonMesg.path: ' +jsonMesg.path);
    console.log('jsonMesg.message: ' +jsonMesg.message);
    // io.to(userSocketIDOperatorChannel).emit('operatorToUser',jsonMesg);
    this.socket.emit('operatorToUser',jsonMesg);
    this.notSelected = true;
  }

  CancelPhoto(){
    console.log('clicked cancel Photo' );
    this.notSelected = true;
  }


}
