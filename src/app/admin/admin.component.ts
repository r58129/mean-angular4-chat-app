import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

let connectedCustomers = {};   // Lu
let currentTab;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  //socket = io('https://192.168.0.102:3638');
    
   // socket = io('192.168.0.102:3638',{secure: true});
   socket = io('https://airpoint.com.hk:3087',{secure: true});
   // socket = io('https://192.168.0.102:3637',{secure: true});

  constructor() {
      
     
        
        
//        let createNewCustomerTab = function(customerId) {
//          var newChatElements: {customerId, tab, window};
//          newChatElements.customerId = customerId;
//          // A tab displaying the customer id
//          newChatElements.tab = $('<li class="chat-tab">').text(customerId);
//          // The chat log for this customer
//          newChatElements.window = $('<ul class="chat-window">').hide();
//
//          var clickHandler = function() {
//            setCurrentTab(newChatElements);
//          };
//          newChatElements.tab.click(clickHandler);
//
//          connectedCustomers[customerId] = newChatElements;
//
//          if(!currentTab) {
//            console.log('Setting current tab');
//            clickHandler();
//          }
//
//          $('#chatTabs').append(newChatElements.tab);
//          $('#chatWindows').append(newChatElements.window);
//        } 
  }

    
    
  ngOnInit() {
      
//      history.pushState({},"Edit","");

  this.socket.emit('user','admin');

  /*this.socket.on('users', function(data){
  	console.log("inside socket.io users" +data);
  // alert(JSON.stringify(data));
  // $('#users').empty();
  for(var i in data){
    $('#users').append('<li>'+data[i]+'</li>');
	console.log("inside socket.io users" +data[i]);
  }
  
 //    $('#users').append('<li>'+data+'</li>');
	// console.log("inside socket.io users" +data);
  
	});
*/
      
            
  this.socket.on('chat', function(msg){
    $('#messages').append('<li>'+msg+'</li>');
  });

  this.socket.on('disconnect', function(msg){
    $('#messages').append('<li>'+msg+'</li>');
  });
      
       this.socket.on('users', function(arg1, arg2) {
  // ...
      
           var newChatElements: any = {};
    
           
   // var newChatElements:chatElements;         
          
     newChatElements.customerId = arg2;
    // A tab displaying the customer id
    newChatElements.tab = $('<li class="chat-tab">').text(arg2);
    // The chat log for this customer
    newChatElements.window = $('<ul class="chat-window">').hide();

    var clickHandler = function() {
        setCurrentTab(newChatElements);
    };
    newChatElements.tab.click(clickHandler);

    //         connectedCustomers[arg2] = newChatElements;

    if(!currentTab) {
    console.log('Setting current tab');
    clickHandler();
    }

    $('#chatTabs').append(newChatElements.tab);
    $('#chatWindows').append(newChatElements.window);

    $('#users').empty();
    
      for(var i in arg1){
    $('#users').append('<li>'+arg1[i]+'</li>');
      $('#users').append('<li>'+arg2+'</li>');
    }
      
});
      
      
           // Switch to a different tab
        let setCurrentTab = function(target) {
            // Do nothing if this is already the current tab
            if(currentTab === target) return;
            // Set the current tab
            currentTab = target;
            // Remove any other selected tab
            $('li.chat-tab').removeClass('selected');
            // Mark this tab as selected
            target.tab.addClass('selected');
            // Hide any other chat windows
            $('.chat-window').hide();
            // Show this chat window
            target.window.show();
        }

  }

    
    ngOnDestroy(){
        
        //socket.emit('forceDisconnect');
        this.socket.disconnect();
        
    }
    
  SendForm(){
  	console.log("admin is sending a message");
      
    var obj = { type:"text", path:"null", message: $('#m').val() };
      this.socket.emit('chat message', obj);
  	//this.socket.emit('chat message', $('#m').val());
    $('#m').val('');
    // return false;
  }

  Connect(){
  	console.log("admin pressed connect button");
  	 this.socket.emit('connectuser', $('#u').val());
    $('#u').val('');
    // return false;
  }

  

    

}
