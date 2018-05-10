import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';

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
  // socket = io('http://localhost:4000');
  socket = io('http://192.168.0.102:3637');
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user!==null) {
      this.getChatByRoom(user.room);  //from chatService
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

}
