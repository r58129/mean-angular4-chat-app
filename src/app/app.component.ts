import { Component } from '@angular/core';
// import { AuthserviceService } from './authservice.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'app works!';

    constructor(public authService: AuthService) { }
    // constructor(public authService: AuthserviceService) { }
}
