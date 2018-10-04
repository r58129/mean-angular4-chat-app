import { Component } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  confirm: string;
  // companyName: string;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log("inside register components");
    console.log("this.credentials.name: " + this.credentials.name);
    console.log("this.credentials.email: " + this.credentials.email);
    console.log("this.credentials.password: " + this.credentials.password);
    console.log("this.confirm.password: " + this.confirm);
    // console.log("this.confirm.password: " + this.companyName);

    if (this.confirm == this.credentials.password){
      this.authService.register(this.credentials).subscribe(() => {
        console.log("inside auth.register");
  
        this.authService.logoutAfterRegistered();
        // this.router.navigateByUrl('/api/profile');
        // this.router.navigateByUrl('/');
        if (window.alert('Successfully registered! Please login to start your session.')){
          // this.authService.logoutAfterRegistered();
        }
        // this.router.navigate('/api/profile');
      }, (err) => {
        console.error(err);
        window.alert('This email has been registered!');
        console.log("you get error in auth.register");
      });
    } else {
      window.alert('Passwords do not match!');
      console.log("Retype password");
    }

  }
}