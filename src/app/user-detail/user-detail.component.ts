import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @HostBinding('class.view-user') 
  viewUser: any;

  // user = '';
  // getUrl = '';
  user: any =[];
  edit: boolean = false;

  userDetail = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //user detail

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

    this.chatService.change.subscribe(viewUser => {
      console.log("this.viewUser.phone_number: "+viewUser.phone_number);
      this.userDetail.phone_number = viewUser.phone_number;

      this.showUserDetail(this.userDetail.phone_number);

    });

  }

  showUserDetail(phoneNum){

	this.chatService.showUser(phoneNum).then((res) => {  //from chatService, 
      this.user = res;
    }, (err) => {
      console.log(err);
    });
  }
   
  saveUserDetail(data){

	this.chatService.saveUser(data).then((res) => {  //from chatService, 
      // this.user = res;
    }, (err) => {
      console.log(err);
    });
  }

  updateUserDetail(phoneNum, data){

	this.chatService.updateUser(phoneNum, data).then((res) => {  //from chatService, 
      // this.user = res;
    }, (err) => {
      console.log(err);
    });
  }

  editUserDetail(){

  	console.log('will implement edit user detail!');
  }

  addUser(){

  	console.log('will implement add user!');

  }

  exit() {
    console.log("Exit the user Detail");
    this.edit = false;
  }    
}
