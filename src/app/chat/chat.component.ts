import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
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
  newUser = { nickname: '', room: '' };
  msgData = { room: '', nickname: '', message: '' };
  //new request
  requests: any;  //new request
  newRequest = { room:'', admin_name:'', phone_number: '', message: '', session_id:'',updated_at:'' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  socket = io('https://192.168.0.102:3638',{secure: true});
  
  constructor(private chatService: ChatService, router: Router) {

// Lu   route.params.subscribe(
//
//        params=>{
//
//          this.newUser.room = parseInt(params['']);
//        }
//
//      )
  }

  ngOnInit() {

    var user = JSON.parse(localStorage.getItem("user"));
    // var request = JSON.parse(localStorage.getItem("request"));

 //    this.socket.emit('user','admin');

 //    this.socket.on('users', function(data){
 //      console.log("inside socket.io users" +data);
 //  // alert(JSON.stringify(data));
 //  // $('#users').empty();
 //      for(var i in data){
 //      $('#users').append('<li>'+data[i]+'</li>');
 //    console.log("inside socket.io users" +data[i]);
 //    }
  
 // //    $('#users').append('<li>'+data+'</li>');
 //  // console.log("inside socket.io users" +data);
  
 //  });

 //  this.socket.on('chat', function(msg){
 //    $('#messages').append('<li>'+msg+'</li>');
 //  });

 //  this.socket.on('disconnect', function(msg){
 //    $('#messages').append('<li>'+msg+'</li>');
 //  });


    if(user!==null) {
      this.getChatByRoom(user.room);  //from chatService
      // this.getRequestByRoom(request.phone_number);  //testing
      this.msgData = { room: user.room, nickname: user.nickname, message: '' }
      this.joinned = true;
      this.scrollToBottom();
      this.scrollTableToBottom();
    }
    this.socket.on('new-message', function (data) {
      if(data.message.room === JSON.parse(localStorage.getItem("user")).room) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' }
        this.scrollToBottom();
        this.scrollTableToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.scrollTableToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

   scrollTableToBottom(): void {
    try {
      this.myScrollTableContainer.nativeElement.scrollTop = this.myScrollTableContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getChatByRoom(room) {
    this.chatService.getChatByRoom(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    var date = new Date();
    localStorage.setItem("user", JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.room);
    this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.socket.emit('save-message', { room: this.newUser.room, nickname: this.newUser.nickname, message: 'Join this room', updated_at: date });
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    var date = new Date();
    var user = JSON.parse(localStorage.getItem("user"));
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    localStorage.removeItem("user");
    this.joinned = false;
  }

  SendForm(){
    console.log("admin is sending a message");
    this.socket.emit('chat message', $('#m').val());
    $('#m').val('');
    // return false;
  }

  Connect(){
    console.log("admin pressed connect button");
     this.socket.emit('connectuser', $('#u').val());
    $('#u').val('');
    // return false;
  }

  createRoom() {
    var date = new Date();
    console.log("create Room");
    // this.getSingleRequest(id);
    console.log("get Single Request");
    // localStorage.setItem("request", JSON.stringify(this.newRequest));
    this.getRequestByRoom(this.newRequest.phone_number);
    // this.msgData = { room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.newRequest = { room: this.newRequest.phone_number, phone_number: this.newRequest.phone_number, admin_name: this.newRequest.admin_name, message: '',  session_id: this.newRequest.session_id,  updated_at: this.newRequest.updated_at };
    // this.newRequest = { room: '85292445713', phone_number: '85292445713', admin_name: 'admin', message: '',  session_id: 'this.newRequest.session_id',  updated_at: 'date' };
    this.joinned = true;
    console.log(this.newRequest.phone_number);
    console.log(this.newRequest.admin_name);
    console.log("before socket emit");

    this.socket.emit('save-message', { room: this.newRequest.phone_number, nickname: this.newRequest.admin_name, message: 'Join this room', updated_at: date });

  }

  getAllRequest() {
    var human = "human";
    this.chatService.getAllRequest(human).then((res) => {  //from chatService, 
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

  getRequestByRoom(room) {
    this.chatService.getRequestByRoom(room).then((res) => {  //from chatService, here room=phone number
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

  getSingleRequest(id) {
    this.chatService.showRequest(id).then((res) => {  //from chatService, here room=phone number
      this.requests = res;
    }, (err) => {
      console.log(err);
    });
  }

}
