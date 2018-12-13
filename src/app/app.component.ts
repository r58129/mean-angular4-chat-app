import { Component, OnInit } from '@angular/core';
// import { AuthserviceService } from './authservice.service';
import { AuthService } from './auth/auth.service';
// declare var jQuery:any;
import { Title }     from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'app works!';

    constructor(public authService: AuthService,private titleService: Title) { }
    // constructor(public authService: AuthserviceService) { }
    ngOnInit() {
        // jQuery.AdminLTE.layout.activate();
    }
    
      public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
}
