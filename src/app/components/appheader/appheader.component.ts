import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../authservice.service';
import { Configs } from '../../configurations';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit {



  constructor(public authService: AuthserviceService, public configs: Configs) { }

  ngOnInit() {

  		// console.log ("print isAuthenticated(): " +this.authService.isAuthenticated());
  }
logout() {
    this.authService.logout(sessionStorage.getItem("tinkerport"));
 //   this.setMessage();
 	// console.log ("print isAuthenticated(): " +this.authService.isAuthenticated());
  }
}
