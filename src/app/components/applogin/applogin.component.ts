//import { Component, OnInit } from '@angular/core';
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
      
    //this.setMessage();
  }

  setMessage() {
    this.message = 'You are logged ' + (this.authService.isAuthenticated() ? 'in' : 'out');
  }

  login() {
    this.message = 'Trying to log in ...';

      this.authService.login();
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
    this.authService.logout();
 //   this.setMessage();
  }
}