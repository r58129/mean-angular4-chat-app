import { Component, Output, EventEmitter, HostListener, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';


import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-oprequest',
  templateUrl: './oprequest.component.html',
  styleUrls: ['./oprequest.component.css']
})

export class OprequestComponent implements OnInit {

  private unsubscribe: Subject<any> = new Subject();
  // private subscription: Subscription = new Subscription();

  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  

  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  loadList: any;
  joinned: boolean = false;
  notSearch: boolean = true;
  contacts: any;  //contacts
  searchName: any;
  id:string;
  appName:string;
  newUser = { nickname: '', room: '' };
  newRequest = {type:'', phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  userInfo = {id:'', name:'', package:'' };
  searchUser:any;
  // newRequest = { room:'', phone_number: '', message: '', socket_id:'',updated_at:'' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  // socket = io('https://192.168.0.102:3637');
  // socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});
  
  constructor(private chatService: ChatService, private configs: Configs) {}

  @HostListener('click')
  clickedCopy(searchUser) {

    if (searchUser !=undefined){

    console.log('this.searchUser.id: ' +searchUser.id);
    console.log('this.searchUser.package: ' + searchUser.package);

    this.chatService.copyInfo(searchUser);
    }
  }

  ngOnInit() {

    this.getOperatorRequest();
    // this.scrollTableToBottom();

    
  this.timer = setInterval(() => {
    this.getOperatorRequest();
    // console.log("operator refresh requests");
  }, 3000);

    this.loadList = setInterval(() => {
    this.scrollTableToBottom();
    // console.log("operator refresh requests");
  }, 5000);

  }  //ngOnInit

  ngOnDestroy(){
        
    this.unsubscribe.next();
    this.unsubscribe.complete();
        //socket.emit('forceDisconnect');
    this.socket.disconnect();
    if (this.timer){
      clearInterval(this.timer);
      console.log('stop refreshing');
    }

    if (this.loadList){
      clearInterval(this.loadList);
      console.log('stop loadList');
    }

  }

    
  // ngAfterViewChecked() {
  //   // this.scrollTableToBottom();
  // }


  scrollTableToBottom(): void {
    try {
      this.myScrollTableContainer.nativeElement.scrollTop = this.myScrollTableContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getOperatorRequest(){
  	// var operator_request = "true";
    this.chatService.getOperatorRequest().then((res) => {  //from chatService, 
      this.requests = res;
    }, (err) => {
      console.log(err);
    });

  }

  returnToTable(){
    this.notSearch = true;
    console.log("return to table view");
  }

  search(){
  this.notSearch = false;
  console.log("searching: " + this.searchName);

    if ((this.searchName == undefined) || (this.searchName == "")){
      this.chatService.getAllContact().then((res) => {  //from chatService, 
        this.contacts = res;
      }, (err) => {
        console.log(err);
      });

    } else {

    this.chatService.getContactByName(this.searchName).then((res) => {  //from chatService, 
        this.contacts = res;
      }, (err) => {
        console.log(err);
      });
    }
  }

}

