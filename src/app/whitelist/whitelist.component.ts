import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs';


import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.css']
})
export class WhitelistComponent implements OnInit {

	allWhitelistUser: any;  //allWhitelistUser
	existingUserList: any;  //existingUserList
	filteredWhitelistUser: any;  //filteredWhitelistUser
	userDetail: any;  // userDetail
	notSearch: boolean = true;
	// x: string;

	newUser = { phone_number:'', nickname:''};  //newUser
	existingUser = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //new user


  	constructor(private chatService: ChatService, private configs: Configs) {}

    @HostListener('click')
    clickedAdd(addUser) {

	    if (addUser !=undefined){

		    console.log('addUser number: ' +addUser);

		    // this.chatService.addWhitelistUser(addUser);
		    this.newUser.phone_number = addUser;
        this.newUser.nickname = 'Dear customer';

		    console.log(this.newUser.phone_number);
				this.chatService.saveUser(this.newUser).then((res) => {  //from chatService, 
			      
			    window.alert('User is added successfully!');
			  }, (err) => {
			    console.log(err);
			    window.alert('Add User failed!');
			  });	      
	    }
  	}

  	ngOnInit() {

  		this.getAllUserDetail();
  		this.getWhatsappWhiteListUser();
  	}

  	getWhatsappWhiteListUser(){
  	  
      this.chatService.getAllWhatsappUserList().then((res) => {  //from chatService, 
      	this.allWhitelistUser = res;	//{"85212345678", "85212346579", "85212345680",...}

      		this.chatService.getWhatsappUserPhoneList().then((result) =>{
      			this.existingUserList = result;

      			console.log(this.allWhitelistUser);
      			console.log(this.existingUserList);
      			this.filteredWhitelistUser = this.allWhitelistUser.filter(x => !this.existingUserList.includes(x));
      			console.log(this.filteredWhitelistUser);

      		}, (err) => {
      			console.log(err);
      		});


    	}, (err) => {
      	console.log(err);
      });
  	}

  	getAllUserDetail(){
  	  
      this.chatService.getAllUser().then((res) => {  //from chatService, 
      	this.userDetail = res;
    	}, (err) => {
      	console.log(err);
      });
  	}  	

    refreshWhiteList(){
      this.getWhatsappWhiteListUser();      
    }

    refreshUserList(){
      this.getAllUserDetail();      
    }    

}
