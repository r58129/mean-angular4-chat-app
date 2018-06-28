import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../authservice.service';

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.css']
})
export class AppfooterComponent implements OnInit {

  constructor(public authService: AuthserviceService) { }

  ngOnInit() {
  }

}
