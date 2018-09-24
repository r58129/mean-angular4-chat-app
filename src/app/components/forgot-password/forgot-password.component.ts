import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  email: string;

  constructor(private authService: AuthService, private router: Router) {}

  forgotPassword() {
    console.log("inside forgot password components: " +this.credentials.email);
	  this.authService.forgotPassword(this.credentials).subscribe(() => {
    console.log('post forgot password link');
      // this.authService.logout();
    
    window.alert('Please check your email and follow the instructions to reset password!');
    this.router.navigateByUrl('/');
    
      console.log("redirect the link to login");
    }, (err) => {
      window.alert('User is not found!');
      console.error(err);
    });
  }

}
