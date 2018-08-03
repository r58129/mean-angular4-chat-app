import { Component, OnInit } from '@angular/core';
// import { AuthserviceService } from './authservice.service';
import { AuthService } from './auth/auth.service';
// declare var jQuery:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'app works!';

    constructor(public authService: AuthService) { }
    // constructor(public authService: AuthserviceService) { }
    ngOnInit() {
        // jQuery.AdminLTE.layout.activate();
    }
}
