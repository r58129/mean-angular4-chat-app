import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  socket = io('http://192.168.0.102:3637');

  constructor() { }

  ngOnInit() {

  this.socket.emit('user','admin');

  this.socket.on('users', function(data){
  	console.log("inside socket.io users" +data);
  //alert(JSON.stringify(data));
  $('#users').empty();
  for(var i in data){
    $('#users').append('<li>'+data[i]+'</li>');
		console.log("inside socket.io users" +data[i]);
  }});

  this.socket.on('chat', function(msg){
    $('#messages').append('<li>'+msg+'</li>');
  });

  this.socket.on('disconnect', function(msg){
    $('#messages').append('<li>'+msg+'</li>');
  });

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

}
