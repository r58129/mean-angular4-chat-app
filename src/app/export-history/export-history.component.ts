import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { Buffer } from 'buffer';
//import { Configs } from '../configurations';
import { Configs } from '../../environments/environment';

@Component({
  selector: 'app-export-history',
  templateUrl: './export-history.component.html',
  styleUrls: ['./export-history.component.css']
})
export class ExportHistoryComponent implements OnInit {


  @HostBinding('class.view-user') 
  viewUser: any;

  user: any =[];
  editDetail: boolean = false;
  viewDetail: boolean = true;
  addUserPage: boolean = false;
  editUserPage: boolean = false;


  userDetail = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //user detail
  // editUser = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //user detail
  newUser = { phone_number:'', first_name: '',middle_name: '', last_name: '' , nickname:'', service:'', default_spoken_lang:'',default_text_lang:'',reserve1:'', reserve2:''};  //new user

  constructor(private chatService: ChatService, private route: ActivatedRoute, private configs: Configs) {}

  ngOnInit() {

    this.chatService.change.subscribe(viewUser => {
      console.log("this.viewUser.phone_number: "+viewUser.phone_number);
      this.userDetail = viewUser;
      
    });

  }

    
  exit() {
    console.log("Exit the user Detail");
    this.editDetail = false;
  }    

}
