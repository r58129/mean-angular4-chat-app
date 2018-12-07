import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserDetails } from '../../auth/auth.service';
import { AuthGroup } from '../../auth/auth.type';
declare function requestPermission(): any;

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit {

  staffRole: string;	
	exportHistory: boolean = false;
	userServices: boolean = false;
	userList: boolean = false;
	whiteList: boolean = false;
	marketingServices: boolean = false;	
	broadcast: boolean = false;
	campaign: boolean = false;
	adminSetting: boolean = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {

  	// console.log("inside menubar");
  	// console.log("route.data" + this.route.data['role']);

    this.authService.profile().subscribe(user => {
      this.staffRole = user.role;
      // console.log('role in menubar: ' + this.staffRole);      

      if (this.staffRole == 'BASIC'){
				// this.exportHistory = true;
				// this.userList = true;				
				// this.userList = true;
				// this.whiteList = true;
				// this.marketingServices = true;	
				// this.broadcast = true;
				// this.campaign = true;
				// this.adminSetting = true;       	

      }
      if (this.staffRole == 'BASIC+'){
				this.exportHistory = true;
				this.userServices = true;
				this.userList = true;
				// this.whiteList = true;
				// this.marketingServices = true;	
				// this.broadcast = true;
				// this.campaign = true;
				// this.adminSetting = true;   
    
      }
      if (this.staffRole == 'PREMIUM'){
				this.exportHistory = true;
				this.userServices = true;
				this.userList = true;
				this.whiteList = true;
				// this.marketingServices = true;	
				// this.broadcast = true;
				// this.campaign = true;
				// this.adminSetting = true;   
  
      }
      if (this.staffRole == 'PREMIUM+'){
				this.exportHistory = true;
				this.userServices = true;
				this.userList = true;
				this.whiteList = true;
				this.marketingServices = true;	
				this.broadcast = true;
				this.campaign = true;
				// this.adminSetting = true;   

      }
      if (this.staffRole == 'ADMIN'){
				this.exportHistory = true;
				this.userServices = true;
				this.userList = true;
				this.whiteList = true;
				this.marketingServices = true;	
				this.broadcast = true;
				this.campaign = true;
				this.adminSetting = true;            	

      }  
        
        requestPermission();
        
    }, (err) => {
      console.error(err);
    });
  }

// private showMenuBarItem(authGroup: AuthGroup) {
// 	console.log(this.authService.hasPermission(authGroup));
//      return this.authService.hasPermission(authGroup);
// }

// private showMenuItem() {
// 		if (this.authService.permissions ! =undefined) {
// 			console.log("this.authService.permissions" +this.authService.permissions);
//      	// return this.authService.hasPermission(authGroup);
//      	this.showMenuItem = true;			
// 		}
// 		this.showMenuItem = false;

// }

}
