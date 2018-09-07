import { Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService, UserDetails } from '../../auth/auth.service';
//import { Configs } from '../../configurations';
import { Configs } from '../../../environments/environment';
import { ChatService } from '../../chat.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //  'Content-Type':'application/x-www-form-urlencoded'
    //'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit, OnDestroy{
  
  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  curSid:string = "0"; 
  joinned: boolean = false;
  package: string;

  newUser = { nickname: '', room: '' };
  newRequest = { type:'', phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  CusMsgData = { type:'', phone_number: '', socket_id: '', room: '', nickname: '', message: '' };

  socket = io(this.configs.socketIoServerAddr,{secure: true});
  // socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  
  // constructor(public http: HttpClient, public authService: AuthserviceService, private chatService: ChatService, private configs: Configs) {

  // }

  constructor(public http: HttpClient, public authService: AuthService, private chatService: ChatService, private configs: Configs) {}
  // constructor(public authService: AuthserviceService, public configs: Configs) { }

  ngOnInit() {
  	console.log("appheader ngOnInit");

  // if (this.authService.isLoggedIn()) {
    this.socket.emit('user','admin');
    // console.log("emit admin socket");

    // register to multichat server
     // this.http.post (this.configs.multiChatAddr+'/api/csp/register'+this.configs.multiChatPort+'?action=register&sessionID='+this.configs.multiChatCode, 
    this.http.post (this.configs.multiChatAddr+'/api/csp/register?action=register&sessionID='+this.configs.multiChatCode, 
    {}, httpOptions)
    .pipe(
    catchError(this.handleErrorObservable)
    ).subscribe(
      res => {      
        console.log('register to mutlichat server');  
        return true;
      });

    this.socket.on('users', (userid, socket_id) => {
    
      var date = new Date();
      // console.log("inside users socket.on");
      // console.log("print userid:" +userid);
      // console.log("print socket.id:" +socket_id);

    if ((userid.sender != undefined) && (userid.package != undefined)){
      this.package = userid.package;
      userid = userid.sender;
      console.log("print userid.sender: " +userid);
      console.log("print userid.package: " +this.package);
      console.log("print socket.id:" +socket_id);
    } else {
      userid = userid;
      this.package = 'whatsapp';
      console.log("print userid: " +userid);
      console.log("print package: " +this.package);
      console.log("print socket.id:" +socket_id);
    }
      
  
   if (userid != 'admin'){
  	 	console.log("print userid before saveChat: " +userid);
   		console.log("print socket_id before saveChat: " +socket_id);
      console.log("print package before saveChat: " +this.package);
   // use status field to classify the new and old request
   this.newRequest = {type: this.package, phone_number: userid, socket_id: socket_id, room: userid, message: 'Customer service request', request_status:'New' };
   	console.log(this.newRequest.room);
   	console.log(this.newRequest.phone_number);
   	console.log(this.newRequest.socket_id);
   	console.log(this.newRequest.message);
   	console.log(this.newRequest.request_status);
    console.log(this.newRequest.type);
 	// console.log(this.newRequest.updated_at);

    if (this.newRequest.socket_id!=undefined){
    //check if this socket id exist
      // console.log("oldSid: " +this.oldSid);
      console.log("curSid: " +this.curSid);
      if (this.newRequest.socket_id!=this.curSid){
      // this.chatService.showRequestSocket(this.newRequest.socket_id).then((result) => {
      //   if (result == 0){
      //     console.log( result +" entry found. Updating DB..." );

          this.curSid = this.newRequest.socket_id;
          console.log("curSid: " +this.curSid);
          console.log("socket_id: " +this.newRequest.socket_id);

          this.chatService.saveRequest(this.newRequest).then((result) => {
            this.socket.emit('save-message', result);
            console.log( "Updated DB" );
          }, (err) => {
          console.log(err);
          });


   //  setTimeout(()=> {
    // this.chatService.saveRequest(this.newRequest).then((result) => {
   //    this.socket.emit('save-message', result);
    //   }, (err) => {
    //     console.log(err);
    //   });
   //  },2000);
  
      }  else {  //this.newRequest.socket_id!=this.curSid
        console.log("duplicated entry, will not update DB");
      }
    }  // (this.newRequest.socket_id!=undefined)
  	}	  //if 
  });  //end socket

  this.socket.on('customerQuit', function(userid, socketID){
    console.log('App header customerQuit: ' + userid);
    console.log("socketID in customerQuit: " +socketID);
    // console.log("curSid in customerQuit: " +this.curSid);  
    // var message = "User quit!";

    if ((userid.sender != undefined) && (userid.package != undefined)){
      this.package = userid.package;
      userid = userid.sender;
      // console.log("print userid.sender: " +userid);
      // console.log("print userid.package: " +this.package);
      // console.log("print socket.id:" +socketID);
    } else {
      userid = userid;
      this.package = 'whatsapp';
      // console.log("print userid: " +userid);
      // console.log("print package: " +this.package);
      // console.log("print socket.id:" +socketID);
    }

    if ((userid != "transport close") && (userid != "operatorSessionUserNonAndroid") && (userid !="operatorNonAndroid")){
      console.log("print userid: " +userid);
      console.log("print package: " +this.package);
      console.log("print socket.id:" +socketID);

    //update request_status to quit when customer is quit
    var updateStatus = { request_status:"Quit"};

    this.chatService.getChatStatusBySocket(socketID).then((res) => {  //from chatService
      this.requests = res;
      if (this.requests[0].request_status != undefined){
        var curStatus = this.requests[0].request_status;
        console.log("get request status: " + JSON.stringify(this.requests[0]));
        console.log("get request status: " + this.requests[0].request_status);
        console.log("curStatus: " + curStatus);

      if (curStatus == "New"){
        this.chatService.updateChatBySocket(socketID, updateStatus).then((res) => {  //from chatService
          console.log("status updated to Quit");
        }, (err) => {
          console.log(err);
        });
      } else {
          console.log("status is not updated");
      }
    }  else {// if (this.requests[0].request_status != undefined){
          console.log("request_status is undefined");
    }
    }, (err) => {
      console.log(err);
    });

  }  // if ((userid != "transport close") || (userid != "operatorSessionUserNonAndroid"))
  }.bind(this));
  
    
    
  // console.log('before register to tinker, session id: ' + localStorage.getItem('res.data.sessionID'))
  // this.http.post (this.configs.tinkerboardAddr+":"+this.configs.tinkerport+'/api/csp/register?action=register&sessionID='+localStorage.getItem('res.data.sessionID'), 
  //   {}, httpOptions)
  //     .pipe(
  //     catchError(this.handleErrorObservable)
  //   ).subscribe(
  //       res => {
  //   // this.getHumanRequest();         
  //     console.log('register to tinker');  
  //       });

  	// if (this.authService.isAuthenticated()){
	 
		this.timer = setInterval(() => {
	    	// this.updateRequestCount();
	    	this.chatService.getNewRequestCount().then((res) => {
	    	if (res !== undefined){  //get new request number
	      		this.chats = res;
	      		console.log('new requests: ' + this.chats);
	      		document.getElementById('newRequestCount').textContent = this.chats;
	      		document.getElementById('newCount').textContent = this.chats;
	      	}

	      	else {
	      		this.chats = 0;
	      	}
	    	}, (err) => {
	      	console.log(err);
	    	});
	    	// console.log("Refresh new requests count: " + this.updateRequestCount());
	  	}, 3000);
	// }	//if (this.authService.isLoggedIn()) 
}

  ngOnDestroy(){
       
    // this.unsubscribe.next();
    // this.unsubscribe.complete();
    // //socket.emit('forceDisconnect');
    //unregister multichat server
    this.http.post (this.configs.multiChatAddr+'/api/csp/unregister?action=unregister&sessionID='+this.configs.multiChatCode, 
     // this.http.post (this.configs.multiChatAddr+'/api/csp/unregister'+this.configs.multiChatPort+'?action=unregister&sessionID='+this.configs.multiChatCode, 
    {}, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .subscribe(
        res => {
          console.log('unregister multichat server');
          return true;
        });

    console.log('appheader ngOnDestroy');  
    this.socket.disconnect();
    if (this.timer){
      clearInterval(this.timer);
      console.log('stop refreshing new count');
    }
  }

  private handleErrorObservable (error: Response | any) {
  //console.error(error.message || error);
  //return Observable.throw(error.message || error);
          return "0";
  }
    

  logout() {
    // this.authService.logout(sessionStorage.getItem("tinkerport"));
    this.authService.logout();
    // this.socket.disconnect();
    }
  
}
