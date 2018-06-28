import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../authservice.service';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.component.html',
  styleUrls: ['./appsettings.component.css']
})
export class AppsettingsComponent implements OnInit {

  constructor(public authService: AuthserviceService) { }

  ngOnInit() {
  }

}
