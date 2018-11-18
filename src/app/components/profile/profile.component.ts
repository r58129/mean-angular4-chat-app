import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetails } from '../../auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails;

  constructor(private authService: AuthService) {}
  
  ngOnInit() {    
    this.authService.profile().subscribe(user => {
      this.details = user;
      // console.log('name: ' +user.name);
      // console.log('email: ' +user.email);
      // console.log('role: ' +user.role);
    }, (err) => {
      console.error(err);
    });
  }
}
