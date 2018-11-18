import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Input, HostBinding } from '@angular/core';
import { AuthService, UserDetails } from '../auth/auth.service';
import { ChatService } from '../chat.service';


@Component({
  selector: 'app-staff-plan',
  templateUrl: './staff-plan.component.html',
  styleUrls: ['./staff-plan.component.css']
})
export class StaffPlanComponent implements OnInit {
  
  @HostBinding('class.view-staff') 
  viewStaff: any;  
  staff: any =[];
  editDetail: boolean = false;
  viewDetail: boolean = true;
  staffDetail = { name:'', email: '',role: ''};  //staff detail


  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    
    this.chatService.change.subscribe(viewStaff => {
      console.log("this.viewStaff.email: "+viewStaff.email);
      this.staffDetail = viewStaff;

      this.showStaffDetail(this.staffDetail.email);

    });
  }

  showStaffDetail(email){

		this.authService.getStaffDetail(email).then((res) => {  //from chatService, 
	      this.staff = res;
	    }, (err) => {
	      console.log(err);
	    });
  }

  updateStaffDetail(){
  	// this.editUser = this.user;
  	console.log(this.staffDetail.email);
  	console.log(this.staffDetail.role);

    // this.staffDetail.role = "PREIMUM";


		this.authService.updateStaffPlan(this.staffDetail.email, this.staffDetail).then((res) => {  //from chatService, 
	      
	    window.alert('Staff plan is updated successfully!');
	  }, (err) => {
	    console.log(err);
	    window.alert('Update staff plan failed!');
	  });
		this.viewStaffDetail();
  }

  viewStaffDetail(){

		this.editDetail = false;
		this.viewDetail = true;
		// this.editUserPage = false; 
		// this.addUserPage = false;   	

  	console.log('view staff detail!');
  }

  editStaffDetail(){

		this.editDetail = true;
		this.viewDetail = false;
		// this.editUserPage = true; 
		// this.addUserPage = false; 	

  	console.log('edit staff detail!');
  }
  
  exit() {
    console.log("Exit the user Detail");
    this.editDetail = false;
  }   

  refreshStaff(){
    this.viewStaffDetail();    
  }
}
