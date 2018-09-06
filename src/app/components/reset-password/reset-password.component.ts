import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  confirm: string;

  constructor(private authService: AuthService, private router: Router) {}

  resetPassword() {
    console.log("inside forgot password components: " +this.confirm);
    // console.log("this.credentials.name: " + this.credentials.name);
    // console.log("this.credentials.email: " + this.credentials.email);
    console.log("this.credentials.password: " + this.credentials.password);
    // console.log("this.confirm.password: " + this.confirm);

    // if (this.confirm == this.credentials.password){
    // this.authService.register(this.credentials).subscribe(() => {
    //   console.log("inside auth.register");
  
    //   // this.router.navigateByUrl('/api/profile');
    //   // this.router.navigateByUrl('/');
    //   this.authService.logout();
    //   // this.router.navigate('/api/profile');
    // }, (err) => {
    //   console.error(err);
    //   console.log("you get error in auth.register");
    // });
    // } else {
    //   console.log("Retype password");
    // }

  }

}
