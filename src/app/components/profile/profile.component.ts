import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetails } from '../../auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  details: UserDetails;

  constructor(private auth: AuthService) {}
  
  ngOnInit() {    
    this.auth.profile().subscribe(user => {
      this.details = user;
      console.log('name: ' +user.name);
      console.log('email: ' +user.email);
    }, (err) => {
      console.error(err);
    });
  }
}
