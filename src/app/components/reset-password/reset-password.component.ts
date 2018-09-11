import { Component, OnInit } from '@angular/core';
import { AuthService, TokenPayload } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    resetToken:''
  };

  confirm: string;
  token: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  
      this.route.params.subscribe(params =>{
      // console.log(params);
      this.credentials.resetToken = params['token'];
      // this.credentials.name = this.token;
      console.log(this.credentials.resetToken);     
    });

  }

  resetPassword() {
    
    console.log("inside reset password components: " +this.credentials.password);
    console.log("this.credentials.password: " + this.confirm);
    console.log("token: " +this.credentials.resetToken);

    if ( this.credentials.password == this.confirm){
      console.log('password match');
      this.authService.resetPassword(this.credentials).subscribe(() => {
      console.log('post reset password ');
      console.log("redirect the link to login");
      
      if (window.alert('Password has been reset! Please login to start your session.')){
      this.authService.logout();
      }

    }, (err) => {
      console.error(err);
    });
  } else {
    window.alert('Passwords do not match!');
    console.log("Passwords do not match!")
  }

  }

}
