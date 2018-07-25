import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';


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

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      // this.router.navigateByUrl('/api/profile');
      this.router.navigateByUrl('/request');
      console.log("inside auth.login");
    }, (err) => {
      console.error(err);
    });
  }
}