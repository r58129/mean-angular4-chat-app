import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { AuthserviceService } from '../../authservice.service';
import { Configs } from '../../configurations';

import { ChatService } from '../../chat.service';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit, OnDestroy{
  
  auth: boolean;
  chats: any;
  requests: any;  //new request
  interval: any;
  timer: any;
  joinned: boolean = false;
  newUser = { nickname: '', room: '' };
  newRequest = { phone_number: '', socket_id: '', room:'', message: '', request_status:'' };
  
  socket = io(this.configs.socketIoServerAddr+":"+sessionStorage.getItem("socketioport"),{secure: true});
  
  constructor(public http: HttpClient, public authService: AuthserviceService, private chatService: ChatService, private configs: Configs) {

  }

  // constructor(public authService: AuthserviceService, public configs: Configs) { }

  ngOnInit() {
  	console.log("appheader ngOnInit");
  	// console.log(this.authService.loginStatus());
  	
  	
  	// this.authService.loginStatus()
  	//   // .takeUntil(componentDestroyed(this))
  	//   .subscribe(result =>{
   //    console.log(result);
   //    this.auth = result;
   //    console.log(this.auth);   

   //  });	//end subscribe
  	// }

  	// ngAfterViewInit(){

   //  if (this.auth)  {
    // this.socket.emit('user','admin');

  	// if (this.authService.isAuthenticated()){
  // console.log ("print isAuthenticated(): " +this.authService.isAuthenticated());
    // this.socket.emit('user','admin');

    
 //    this.socket.on('users', (userid, socket_id) => {
    
 //      var date = new Date();
 //      // console.log("inside users socket.on");
 //      console.log("print userid:" +userid);
 //      console.log("print socket.id:" +socket_id);
  
 //   if (userid !== 'admin'){
 //  	 	console.log("print userid before saveChat: " +userid);
 //   		console.log("print socket_id before saveChat: " +socket_id);
 //   // use status field to classify the new and old request
 //   this.newRequest = {phone_number: userid, socket_id: socket_id, room: userid, message: 'Customer service request', request_status:'New' };
 //   	console.log(this.newRequest.room);
 //   	console.log(this.newRequest.phone_number);
 //   	console.log(this.newRequest.socket_id);
 //   	console.log(this.newRequest.message);
 //   	console.log(this.newRequest.request_status);
 // 	// console.log(this.newRequest.updated_at);

 //    if (this.newRequest.socket_id!== undefined){
	// // this.chatService.saveRequest(this.newRequest).then( function(result)  {
	// this.chatService.saveRequest(this.newRequest).then((result) => {
 //      this.socket.emit('save-message', result);
	//     }, (err) => {
	//       console.log(err);
	//     });
 //       }
 //  	}	  //if 
 //  });



//   	// if (this.authService.isAuthenticated()){
	 
// 		this.timer = setInterval(() => {
// 	    	// this.updateRequestCount();
// 	    	this.chatService.getNewRequestCount().then((res) => {
// 	    	if (res !== undefined){  //get new request number
// 	      		this.chats = res;
// 	      		console.log('new requests: ' + this.chats);
// 	      		document.getElementById('newRequestCount').textContent = this.chats;
// 	      		document.getElementById('newCount').textContent = this.chats;
// 	      	}

// 	      	else {
// 	      		this.chats = 0;
// 	      	}
// 	    	}, (err) => {
// 	      	console.log(err);
// 	    	});
// 	    	// console.log("Refresh new requests count: " + this.updateRequestCount());
// 	  	}, 2500);
// 	// }	//if
// // }

	  // }	//end if
   //  });	//end subscribe
}

ngOnDestroy(){
       
    // // this.unsubscribe.next();
    // // this.unsubscribe.complete();
    // //socket.emit('forceDisconnect');
    // // this.socket.disconnect();
    // if (this.timer){
    //   clearInterval(this.timer);
    //   console.log('stop refreshing new count');
    // }
}

// updateRequestCount(){

// 	this.chatService.getNewRequestCount().then((res) => {  //from chatService
//       this.chats = res;
//       console.log('new requests: ' + this.chats);      
//     }, (err) => {
//       console.log(err);
//     });
// }

logout() {
    this.authService.logout(sessionStorage.getItem("tinkerport"));
 //   this.setMessage();
 	// console.log ("print isAuthenticated(): " +this.authService.isAuthenticated());
  }
}
