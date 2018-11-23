import { Component, OnInit, Output, EventEmitter,HostListener  } from '@angular/core';
import { AuthService, UserDetails } from '../auth/auth.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

	staffDetail: any;  
  updateStaff = {email:'', role:''};
  constructor(private chatService: ChatService, private authService: AuthService) { }

   @HostListener('click')
  clickedView(viewStaff) {

    if (viewStaff !=undefined){

    console.log('this.viewStaff.name: ' +viewStaff.name);

    this.chatService.viewStaffRole(viewStaff);
    }
  }  

  ngOnInit() {
  	this.getAllStaffDetail();
  }
  
  getAllStaffDetail(){
  	  // var operator_request = "true";
      this.authService.getAllStaff().then((res) => {  //from chatService, 
      	this.staffDetail = res;
    	}, (err) => {
      	console.log(err);
      });
  	}

  refreshList(){
    this.getAllStaffDetail();      
  }

  // updateStaffRole(){
  // 	console.log( this.updateStaff.role);
  // }



}
