//import { OnInit } from '@angular/core';
//
//@Component({
//  selector: 'app-applogin',
//  templateUrl: './applogin.component.html',
//  styleUrls: ['./applogin.component.css']
//})
//export class ApploginComponent implements OnInit {
//
//  constructor() { }
//
//  ngOnInit() {
//  }
//
//}

import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { AuthserviceService } from '../../authservice.service';

@Component({
    selector: 'app-applogin',
    templateUrl: './applogin.component.html',
//  template: `
//    <h2>LOGIN</h2>
//    <p>{{message}}</p>
//    <p>
//      <button (click)="login()"  *ngIf="!authService.isLoggedIn">Login</button>
//      <button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
//    </p>`,
    styleUrls: ['./applogin.component.css']
})
export class ApploginComponent {
  message: string;

    
  constructor(public authService: AuthserviceService, public router: Router) {
      authService.handleAuthentication();
      
      
//      if (this.profile1){
//          console.log("profile1 exist!!!");
//      }else
//          console.log("profile1 not exist!!!");
      
    //this.setMessage();
  }

  setMessage() {
    this.message = 'You are logged ' + (this.authService.isAuthenticated() ? 'in' : 'out');
  }

    
    profile1: any;
    
    static loginTinkerDone="0";
    
    ngOnInit() {
//    if (this.authService.userProfile) {
//      this.profile1 = this.authService.userProfile;
//     } else {
//      this.authService.getProfile((err, profiley) => {
//        this.profile1 = profiley;
//      });
//    }
  }
    ngAfterContentChecked(){
    if (this.authService.userProfile) {
      this.profile1 = this.authService.userProfile;
        console.log("got profile1 from auth service!!!");
     } else {
      this.authService.getProfile((err, profiley) => {
        this.profile1 = profiley;
          console.log("got profile1 from getProfile call!!!");
      });
    }
  }
    
    ngAfterViewChecked(){
        
        if (this.profile1.nickname){
        console.log("nickname is  "+this.profile1.nickname+"  by Lu");
            if (this.loginTinkerDone=="0"){
        this.authService.loginTinker();
                this.loginTinkerDone="1";
            }
        }
    }
    
  login() {
    this.message = 'Trying to log in ...';
      this.authService.login();
 //     this.profile1=this.authService.handleAuthentication();
      
//      if (this.authService.userProfile) {
//      this.profile1 = this.authService.userProfile;
//     } else {
//      this.authService.getProfile((err, profiley) => {
//        this.profile1 = profiley;
//      });
//    }
      console.log("right after login");
      //this.profile1=this.authService.userProfile;
//    this.authService.login().subscribe(() => {
//      this.setMessage();
//      if (this.authService.isAuthenticated()) {
//        // Get the redirect URL from our auth service
//        // If no redirect has been set, use the default
//        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '';
//
//        // Redirect the user
//        this.router.navigate([redirect]);
//      }
//    });
      

  }

  logout() {
 //     this.loginTinkerDone="0";
    this.authService.logout();
 //   this.setMessage();
  }
}