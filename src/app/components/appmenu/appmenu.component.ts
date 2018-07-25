import { Component, OnInit } from '@angular/core';
// import { AuthserviceService } from '../../authservice.service';
import { AuthService, UserDetails } from '../../auth/auth.service';

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
