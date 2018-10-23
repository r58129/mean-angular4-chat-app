import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval'
import * as io from 'socket.io-client';
import * as $ from 'jquery';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	userDetail: any;  //new request
	notSearch: boolean = true;

  	constructor(private chatService: ChatService, private configs: Configs) {}

    @HostListener('click')
    clickedView(viewUser) {

    if (viewUser !=undefined){

    console.log('this.viewUser.phone_number: ' +viewUser.phone_number);

    this.chatService.viewUserInfo(viewUser);
    }
  }

  	ngOnInit() {

  		this.getAllUserDetail();
  	}

  	getAllUserDetail(){
  	  // var operator_request = "true";
      this.chatService.getAllUser().then((res) => {  //from chatService, 
      	this.userDetail = res;
    	}, (err) => {
      	console.log(err);
      });
  	}

    refreshList(){
      this.getAllUserDetail();      
    }

}
