import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Configs } from '../../configurations';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

 credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router, private configs: Configs) {}

  ngOnInit() {      
    if (!sessionStorage.getItem('loginTinkerDone'))
      {
        sessionStorage.setItem('loginTinkerDone', "0");
      }
  }

  login() {
    this.authService.login(this.credentials).subscribe(() => {
      
      //login to tinker
      if (sessionStorage.getItem('loginTinkerDone')=="0"){
        // this.auth.loginTinker(this.configs.angularAddr+"/"+this.configs.tinkerport);
        this.authService.loginTinker();
        // sessionStorage.setItem('loginTinkerDone', "1");
      }
      
      // don't redirect the link here, do this in logintinker
      // this.router.navigateByUrl('/api/profile');
      // this.router.navigateByUrl('/chat/request');
      console.log("Auth.login is done");
    }, (err) => {
      console.error(err);
    });
  }
}