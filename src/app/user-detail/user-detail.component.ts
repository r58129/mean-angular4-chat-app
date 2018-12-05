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
  user: any =[];
  editDetail: boolean = false;
  viewDetail: boolean = true;
  addUserPage: boolean = false;
  editUserPage: boolean = false;
  showImage: boolean = false;


  userDetail = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //user detail
  // editUser = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //user detail
  newUser = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //new user

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

    this.chatService.change.subscribe(viewUser => {
      console.log("this.viewUser.phone_number: "+viewUser.phone_number);
      this.userDetail = viewUser;

      this.showUserDetail(this.userDetail.phone_number);

    });

  }

  showUserDetail(phoneNum){

		this.chatService.showUser(phoneNum).then((res) => {  //from chatService, 
	      this.user = res;

        if (this.user[0] !=undefined){
          if (this.user[0].namecard.image !=undefined){
            console.log(this.user[0].namecard.image);          
            this.showImage = true;          
          } else {
            this.showImage = false;          
          }           
        }

	    }, (err) => {
	      console.log(err);
	    });
  }
   
  saveUserDetail(){

  	console.log(this.newUser.phone_number);  	

		this.chatService.saveUser(this.newUser).then((res) => {  //from chatService, 
	      
	    window.alert('User is added successfully!');
	  }, (err) => {
	    console.log(err);
	    window.alert('Add User failed!');
	  });
		this.viewUserDetail();

  }

  updateUserDetail(){
  	// this.editUser = this.user;
  	console.log(this.userDetail.phone_number);
  	console.log(this.userDetail.nickname);

		this.chatService.updateUser(this.userDetail.phone_number, this.userDetail).then((res) => {  //from chatService, 
	      
	    window.alert('User detail is updated successfully!\nPress "View" button in User List to view updated data!');
	  }, (err) => {
	    console.log(err);
	    window.alert('Update user detail failed!');
	  });
		this.viewUserDetail();
  }

  viewUserDetail(){

		this.editDetail = false;
		this.viewDetail = true;
		this.editUserPage = false; 
		this.addUserPage = false;   	

  	console.log('view user detail!');
  }

  editUserDetail(){

		this.editDetail = true;
		this.viewDetail = false;
		this.editUserPage = true; 
		this.addUserPage = false; 	

  	console.log('edit user detail!');
  }

  createUser(){

  	this.editDetail = true;
		this.viewDetail = false;
		this.editUserPage = false; 
		this.addUserPage = true; 
  	console.log(' add user!');

  }

  exit() {
    console.log("Exit the user Detail");
    this.editDetail = false;
  }    

  deleteUser(){
    console.log('userDetail: ' +this.userDetail.phone_number)
    if (window.confirm('User will be deleted!')){
      this.chatService.deleteUser(this.userDetail.phone_number).then((res) => {  //from chatService,    
      }, (err) => {
        console.log(err);
      });
    } else {
      console.log('do nothing!')
    }
  	this.viewUserDetail();
  }
}
