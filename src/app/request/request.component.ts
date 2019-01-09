import { Component, OnInit, OnDestroy, AfterViewChecked, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject,  Observable } from 'rxjs';


import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';
// import { AuthserviceService } from '../authservice.service';
import { AuthService, TokenPayload } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
// import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})


export class RequestComponent implements OnInit, AfterViewChecked, AfterViewInit {

  private unsubscribe: Subject<any> = new Subject();
  // private subscription: Subscription = new Subscription();

  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('scrollTable') private myScrollTableContainer: ElementRef;  

  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  curSid:string = "0"; 
  joinned: boolean = false;
  loadList:  boolean = false;
  // newUser = { nickname: '', room: '' };
  // newRequest = { phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  // newRequest = { room:'', phone_number: '', message: '', socket_id:'',updated_at:'' };
  // chatRequest = { room: '', admin_name:'', phone_number: '', message: '', updated_at:'' };
  // socket = io('http://localhost:4000');
  // socket = io('https://192.168.0.102:3637');
  // socket = io('https://192.168.0.102:3637',{secure: true});
  // socket = io('https://airpoint.com.hk:3637',{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  socket = io(this.configs.socketIoServerAddr,{secure: true});
  
  // constructor(public http: HttpClient, private authService: AuthserviceService, private chatService: ChatService, private configs: Configs) {}
  constructor(public http: HttpClient, private authService: AuthService, private chatService: ChatService, private configs: Configs) {}
  
  ngOnInit() {
    
    console.log("request ngOnInit");

    this.getHumanRequest();
           
    this.timer = setInterval(() => {
      // this.refreshData();
      this.getHumanRequest();
      // console.log("refresh requests");
    }, 3000);
  

  }  //ngOnInit

  ngOnDestroy(){

    this.unsubscribe.next();
    this.unsubscribe.complete();
    // this.socket.disconnect();
      if (this.timer){
        clearInterval(this.timer);
        console.log('stop admin request refresh');
      }
  }

  ngAfterViewChecked() {
    // console.log("this.loadList: " +this.loadList);
    // if (this.loadList == false){
      // this.scrollTableToBottom();
    //   this.loadList = true;
    // } else {
    //   //console.log("do nothing");
    // }
  }

  ngAfterViewInit() {
    // console.log("ngAfterViewInit: " +this.loadList);
    // this.scrollTableToBottom();

  }

    
  private handleErrorObservable (error: Response | any) {
	//console.error(error.message || error);
	//return Observable.throw(error.message || error);
          return "0";
  }
    
  scrollTableToBottom(): void {
    try {
      this.myScrollTableContainer.nativeElement.scrollTop = this.myScrollTableContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  getHumanRequest() {
    var customer_service = "human";
    this.chatService.getHumanRequest(customer_service).then((res) => {  //from chatService, 
      this.requests = res;
    }, (err) => {
        //this.authService.logout(this.authService.userProfile[this.configs.angularAddr+"/tinkerport"]);
        // this.authService.logout(sessionStorage.getItem("tinkerport"));  //TBD
      console.log(err);
    });
  }

}

