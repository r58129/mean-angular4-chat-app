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

  timeRange = {start_time: '', end_time:''};
  newUser = { nickname: '', room: '' ,socket_id: '', db_id:'', request_status:''};
  msgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };
  CusMsgData = { phone_number: '', socket_id: '', room: '', nickname: '', message: '' };

  today = new Date();
  dd = this.today.getDate();
  mm = this.today.getMonth()+1; //January is 0!
  yyyy = this.today.getFullYear();
  todayNum: number = this.yyyy*10000 + this.mm*100  + this.dd;
  startNum: number;
  endNum: number;

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

     if ((this.timeRange.start_time != '') && (this.timeRange.end_time !='')){
      
      console.log("this.timeRange.start_time:" +this.timeRange.start_time);
      console.log("this.timeRange.end_time:" +this.timeRange.end_time);       

      this.startNum = parseInt(this.timeRange.start_time);
      this.endNum = parseInt(this.timeRange.end_time);

      console.log ('start Time: ' + this.startNum);
      console.log ('end Time: ' + this.endNum);
      console.log ('today: ' + this.todayNum);

      if ((this.endNum > this.todayNum) || (this.endNum < this.startNum) || (this.todayNum < this.startNum)){

        console.log('There is something wrong with the input date!');
        window.alert('There is something wrong with the input date!');
      } else {
      
        this.chatService.getRangedChatHistory(this.timeRange.start_time, this.timeRange.end_time, room).then((res) => {  //from chatService
          this.chats = res;
        }, (err) => {
          console.log(err);
        });     

        this.joinned = true;        
      }
     } else {
      
      this.chatService.getAllChatHistory(room).then((res) => {  //from chatService
        this.chats = res;
      }, (err) => {
        console.log(err);
      });

      this.joinned = true;
    }
  }

  joinRoom() {
    console.log('joinRoom to view chst history: ');
    this.getAllChatByRoom(this.newUser.room);
    // this.msgData = {phone_number:this.newUser.room, socket_id: this.newUser.socket_id, 
    //   room: this.newUser.room, nickname: this.newUser.nickname, message: '' };
    // this.joinned = true;
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
