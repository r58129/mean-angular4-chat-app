import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload, UserDetails } from '../../auth/auth.service';
import { Router } from '@angular/router';
//import { Configs } from '../../configurations';
import { Configs } from '../../../environments/environment';
// import * as $ from 'jquery';
// declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials: TokenPayload = {
    email: '',
    password: '',
    tinkerSessionId:'',
    online:''
  };

  details: UserDetails;
  
  

  constructor(private authService: AuthService, private router: Router, private configs: Configs) {}

  ngOnInit() {      
    // var $layout = $('body').data('lte.layout');
    // $layout.activate() ;
    // $layout.fixed();
    // $('body').resize();

    // $.fn.layout.Constuctor.prototype.fix();
  // $layout = $('body').data('lte.layout');  
   // $('body').layout('fixed');


    if (!sessionStorage.getItem('loginTinkerDone'))
      {
        sessionStorage.setItem('loginTinkerDone', "0");
        console.log('login ngOnInit');
      }
  }

  login() {
    this.authService.login(this.credentials).subscribe(() => {
      console.log('login user is done and now login to tinker');

      //login to tinker
      if (sessionStorage.getItem('loginTinkerDone')=="0"){
        // this.auth.loginTinker(this.configs.angularAddr+"/"+this.configs.tinkerport);
        this.authService.loginTinker();
        // sessionStorage.setItem('loginTinkerDone', "1");
      }
      
      this.authService.profile().subscribe(user => {
      this.details = user;
      console.log('name: ' +user.name);
      console.log('online: ' +user.online);
      console.log('tinkerSessionId: ' +user.tinkerSessionId);
      // console.log('expressPort: ' +user.expressPort);
      // console.log('tinkerPort: ' +user.tinkerPort);
      // console.log('sokcetIoPort: ' +user.sokcetIoPort);

      }, (err) => {
        console.error(err);
      });

      // this.router.navigateByUrl('/api/profile');
      // this.router.navigateByUrl('/chat/request');

      this.router.navigate(['/chat/request']);
      console.log("redirect the link to request");
    }, (err) => {
      if (window.alert('Incorrect login name or password!')){
        console.error(err);
      }
    });
  }
}