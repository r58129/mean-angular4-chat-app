import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval'
import * as io from 'socket.io-client';
import * as $ from 'jquery';
import { AuthService, UserDetails } from '../auth/auth.service';
import { Configs } from '../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	userDetail: any;  
  whatsappUserList: any;
  userContactList: any;
	notSearch: boolean = true;
  exportUserList: boolean = false;
  staffRole: string;    

  	constructor(private chatService: ChatService, private configs: Configs,private authService: AuthService) {}

    @HostListener('click')
    clickedView(viewUser) {

    if (viewUser !=undefined){

    console.log('this.viewUser.phone_number: ' +viewUser.phone_number);

    this.chatService.viewUserInfo(viewUser);
    }
  }

  	ngOnInit() {

  		this.getAllUserDetail();

      this.authService.profile().subscribe(user => {
        this.staffRole = user.role;
        // console.log('role in user page: ' + this.staffRole);      

        if ((this.staffRole == 'BASIC') ||(this.staffRole == 'BASIC+')){
          // this.exportUserList = true;        
        } 
        if ((this.staffRole == 'PREMIUM') || (this.staffRole == 'PREMIUM+') || (this.staffRole == 'ADMIN')) {
          this.exportUserList = true;   
        }
    
      }, (err) => {
        console.error(err);
      });
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

    exportUser(){

      this.chatService.getAllUser().then((res) =>{
        this.whatsappUserList = res;
        this.exportToCsv(this.whatsappUserList);        
        // console.log(this.whatsappUserList);
        window.alert('Downloaded file can be found in broswer default path!');            
      }, (err) => {
        console.log(err)
      });
    }

    private exportToCsv(data){
      console.log('All csv data: ', data);

      this.userContactList = data.map((obj) =>{
        console.log (obj.phone_number.substring(0,3));
        
        if (obj.phone_number.substring(0,2) == "86"){
          obj.region = "CN";
        }

        if (obj.phone_number.substring(0,3) == "852"){
          obj.region = "HK";
        }        

        return {
          nickname: obj.nickname,
          phone_number: obj.phone_number,
          region: obj.region
        }
      });

      console.log('new json data: ', this.userContactList);
      
      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(this.userContactList[0]);
      let csv = this.userContactList.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      console.log (csvArray);
      
      var fileName = 'userlist.csv';

      var file = new Blob([csvArray], { 
        type: 'text/csv'});
      saveAs(file, fileName);

    }    

}
