import { Component, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserDetails } from '../../auth/auth.service';
import { AuthGroup } from '../../auth/auth.type';

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit {

	showMenuItem: boolean = true;
  staffRole: string;	

  constructor(public authService: AuthService) { }

  ngOnInit() {

  	console.log("inside menubar");
  	// console.log("route.data" + this.route.data['role']);

    // this.authService.profile().subscribe(user => {
    //   this.staffRole = user.role;

    //   console.log('role in menubar: ' + this.staffRole);
    // }, (err) => {
    //   console.error(err);
    // });


  }


// private showMenuItem() {
// 		if (this.authService.permissions ! =undefined) {
// 			console.log("this.authService.permissions" +this.authService.permissions);
//      	// return this.authService.hasPermission(authGroup);
//      	this.showMenuItem = true;			
// 		}
// 		this.showMenuItem = false;

// }

}
