import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../authservice.service';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit {

  constructor(public authService: AuthserviceService) { }

  ngOnInit() {
  }
logout() {
    this.authService.logout();
 //   this.setMessage();
  }
}
