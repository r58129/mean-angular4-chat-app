import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @HostBinding('class.search-user') 
  searchUser: any;
 
  url = '';
  getUrl = '';
  chats: any =[];
  joinned: boolean = false;


  newUser = { nickname: '', room: '' ,socket_id: '', db_id:'', request_status:''};
  msgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: { data:Buffer, contentType:'' }};
  // imgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', filename:'', image: '' };
  // CusImgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '', file_path:'', image: '' };
  CusMsgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  // socket = io('http://localhost:4000');
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  //socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  // socket = io(this.configs.socketIoServerAddr,{secure: true});

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {
    // console.log("inside chat constructor" +this.route.snapshot.params);
  }

  ngOnInit() {
      this.chatService.change.subscribe(searchUser => {
      console.log("this.searchUser.id: "+searchUser.id);
      console.log("this.searchUser.package: "+searchUser.package);
      this.newUser.room = searchUser.id;
      // this.newUser.type = searchUser.package;

      // console.log("this.searchUser.name: "+this.searchUser.name);
    });

  }

  ngOnDestroy(){

  }

  getAllChatByRoom(room) {
     console.log("getAllChatbyRoom:" +room);
    this.chatService.getAllChatHistory(room).then((res) => {  //from chatService
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    console.log('joinRoom to view chst history: ');
    this.getAllChatByRoom(this.newUser.room);
    this.msgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
      room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    this.joinned = true;
    this.scrollToBottom();

  }

    scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  logout() {
    console.log("Exit the room");
    this.joinned = false;
  }
}
